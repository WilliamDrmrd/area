import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionOptions, ServicesCredentials, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionInterface, ActionAbstract, Option } from '../../types';
import { Octokit } from '@octokit/core';
import { ServicesService } from '../../services/services.service';
import { GithubService } from '../github.service';

@Injectable()
export class NewIssue extends ActionAbstract implements ActionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'New-Issue', 'New Issue Action', {
      user: 'The organisation or user who owns the repo.',
      repo: 'the repo to check',
    });
  }

  async executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean> {
    if (
      !options['user'] ||
      !options['repo'] ||
      !data[0].data['automationId'] ||
      !data[0].data['services'] ||
      !data[0].data['user'] ||
      !userCredentials ||
      !userCredentials.credentials
    ) {
      return false;
    }

    const services: ServicesService = data[0].data['services'];
    const user: User = <User>data[0].data['user'];
    const githubService: GithubService = <GithubService>(
      services.services.get('Github')
    );
    const isConnected = githubService.getIsConnected(user);

    if (!isConnected) return false;

    return true;
  }

  async execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<{
    success: boolean;
    runReaction: boolean;
    data?: any;
  }> {
    if (!data[0]['automationId'] || !data[0]['user'])
      return {
        success: false,
        runReaction: false,
        data: {},
      };

    const octokit = new Octokit({
      auth: userCredentials.credentials,
    });

    try {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/issues',
        {
          owner: options['user'],
          repo: options['repo'],
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );

      if (response.status != 200)
        return {
          success: false,
          runReaction: false,
          data: {},
        };

      const automationHistory = await this.prisma.automationHistory.findFirst({
        where: {
          uuid:
            data[0]['automationId'].toString() +
            '-' +
            data[0]['user'].id.toString(),
        },
      });
      if (!automationHistory)
        return {
          success: false,
          runReaction: false,
          data: {},
        };

      if (response.data.length != 0) {
        let lastIssue = null;

        response.data.forEach((issue) => {
          if (
            new Date(issue.created_at) >
              new Date(automationHistory.updatedAt) &&
            (!lastIssue ||
              new Date(issue.created_at) > new Date(lastIssue.created_at))
          )
            lastIssue = issue;
        });

        if (lastIssue)
          return {
            success: true,
            runReaction: true,
            data: {
              object: 'New Issue',
              message: `On repo: ${options['repo']}\nowned by: ${options['user']}
              Issue name: ${lastIssue.title}\nauthor: ${lastIssue.user.login}`,
            },
          };
      }
    } catch (error) {
      console.error('new-issue execute, Erreur de requête :', error);
      return {
        success: false,
        runReaction: false,
        data: {},
      };
    }
    return {
      success: true,
      runReaction: false,
      data: {},
    };
  }
}
