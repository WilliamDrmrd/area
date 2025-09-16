import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { XMLParser } from 'fast-xml-parser';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionAbstract, ActionInterface, Option } from '../../types';
import { joinStrings } from '../../utils/joinStrings';

@Injectable()
export class NewDisaster extends ActionAbstract implements ActionInterface {
  private parser = new XMLParser();
  constructor(prisma: PrismaService) {
    super(prisma, 'New-disaster', 'New scam or disaster');
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
    const hist = await this.prisma.automationHistory.findUnique({
      where: {
        uuid: data[0].cronId,
      },
    });
    const resp = await fetch('https://web3isgoinggreat.com/feed.xml', {
      method: 'GET',
    });
    const text = await resp.text();
    const json = this.parser.parse(text);
    const update = new Date(json.feed.updated);
    const feed: { [key: string]: any }[] = json.feed.entry;

    if (update > hist.runnedAt) {
      await this.prisma.automationHistory.update({
        where: {
          id: hist.id,
        },
        data: {
          runnedAt: update,
        },
      });
      return {
        success: true,
        runReaction: true,
        data: {
          lastUpdate: update,
          object: feed[0].title,
          message: joinStrings(feed[0].content),
          link: feed[0].id,
        },
      };
    }

    return { success: true, runReaction: false };
  }
}
