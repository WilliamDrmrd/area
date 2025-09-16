import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ReactionInterface, ReactionAbstract, Option } from '../../types';

@Injectable()
export class SendMessage extends ReactionAbstract implements ReactionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'Send-Message', 'Send-Message', {
      webhook: 'the webhook you want to send to',
    });
  }

  async execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ) {
    if (
      !data[0].data['message'] ||
      !data[0].data['object'] ||
      !options['webhook']
    ) {
      throw new Error(`Missing parameters`);
    }

    await this.sendMessage(data[0].data, options['webhook']);
    return false;
  }

  async sendMessage(data: { [key: string]: string }, DiscordWebhook: string) {
    try {
      const embed = {
        title: data['object'],
        description: data['message'],
      };
      data['link'] ? (embed['url'] = data['link']) : null;
      data['image'] ? (embed['image'] = { url: data['image'] }) : null;

      const payload = {
        username: 'AreaHook',
        embeds: [embed],
      };
      const response = await fetch(DiscordWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Message sent successfully to Discord!');
      } else {
        console.error(
          'Failed to send message to Discord:',
          response.statusText,
        );
      }
    } catch (e) {
      console.error('Error sending message to Discord:', e);
      return false;
    }
  }
}
