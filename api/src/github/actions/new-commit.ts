import { Injectable } from '@nestjs/common';
import { ServicesCredentials, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionAbstract, ActionInterface, Option } from '../../types';
import { Octokit } from '@octokit/core';
import { ServicesService } from '../../services/services.service';
import { GithubService } from '../github.service';

@Injectable()
export class NewCommit extends ActionAbstract implements ActionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'New-Commit', 'New Commit Action', {
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

    return githubService.getIsConnected(user);
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
    const octokit = new Octokit({
      auth: userCredentials.credentials,
    });

    try {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/commits',
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
        let lastCommit = null;

        response.data.forEach((commit) => {
          if (
            new Date(commit.commit.committer.date) >
              new Date(automationHistory.updatedAt) &&
            (!lastCommit ||
              new Date(commit.commit.committer.date) >
                new Date(lastCommit.commit.committer.date))
          )
            lastCommit = commit;
        });

        if (lastCommit)
          return {
            success: true,
            runReaction: true,
            data: {
              object: 'New Commit !',
              message: `On repo: ${options['repo']}\nowned by: ${options['user']}
            Commit message: ${lastCommit.commit.message}\nauthor: ${lastCommit.commit.author.name}`,
            },
          };
      }
    } catch (error) {
      console.error('new-commit execute, Erreur de requête :', error);
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
