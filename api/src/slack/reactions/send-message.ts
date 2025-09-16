import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ReactionInterface, ReactionAbstract, Option } from '../../types';

@Injectable()
export class SendMessage extends ReactionAbstract implements ReactionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'Send-Message-Slack', 'Send-Message-Slack', {
      SlackWebhook: 'the webhook you want to send to',
    });
  }

  async execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ) {
    if (!data[0].data['message'] || !options['SlackWebhook']) {
      throw new Error(`Missing parameters`);
    }

    await this.sendMessage(data[0].data['message'], options['SlackWebhook']);
    return false;
  }

  async sendMessage(message: string, SlackWebhook: string) {
    try {
      const payload = {
        text: message,
      };
      const response = await fetch(SlackWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Message sent successfully to Slack!');
      } else {
        console.error('Failed to send message to Slack:', response.statusText);
      }
    } catch (e) {
      console.error('Error sending message to Slack:', e);
      return false;
    }
  }
}
