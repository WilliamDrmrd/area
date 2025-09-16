import {Injectable} from '@nestjs/common';
import {ReactionOptions, ServicesCredentials, User} from '@prisma/client';
import {PrismaService} from '../../prisma/prisma.service';
import {ReactionInterface, ReactionAbstract, Option} from '../../types';
import {ServicesService} from "../../services/services.service";
import {GithubService} from "../github.service";
import {Octokit} from "@octokit/core";

@Injectable()
export class CreateIssue
  extends ReactionAbstract
  implements ReactionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'Create-Issue', 'Create Issue', {
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
  ): Promise<boolean> {
    if (!options['user'] || !options['repo'] || !data[0].data['message'] || !data[0].data['object'])
      return false;

    const octokit = new Octokit({
      auth: userCredentials.credentials,
    });

    try {
      const response = await octokit.request(
        'POST /repos/{owner}/{repo}/issues',
        {
          owner: options['user'],
          repo: options['repo'],
          title: data[0].data['object'],
          body: data[0].data['message'],
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );

      if (response.status != 201)
        return false;
    } catch (error) {
      console.error('create-issue execute, Erreur de requête :', error);
      return false;
    }
    return true;
  }
}
