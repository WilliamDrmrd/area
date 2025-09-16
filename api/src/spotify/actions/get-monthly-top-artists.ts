import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionAbstract, ActionInterface, Option } from '../../types';
import { SpotifyService } from '../spotify.service';
import { Artist } from '../../types/spotifyTypes';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class GetMonthlyTopArtists
  extends ActionAbstract
  implements ActionInterface
{
  spotify: SpotifyService;
  constructor(prisma: PrismaService) {
    super(
      prisma,
      'Get-monthly-top-artists',
      'Get your monthly top 5 artists on spotify',
    );
  }

  async executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean> {
    if (!userCredentials || !userCredentials.credentials) {
      return false;
    }

    const services: ServicesService = data[0].data['services'];
    this.spotify = <SpotifyService>services.services.get('Spotify');

    const isCon = await this.spotify.getIsConnected(data[0].data['user']);
    if (!isCon) {
      const isRef = await this.spotify.refreshCredentials(
        data[0].data['user'].id,
      );
      if (!isRef) return false;
    }

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
    if (!userCredentials) return { success: false, runReaction: false };

    const hist = await this.prisma.automationHistory.findFirst({
      where: {
        uuid: data[0].cronId,
      },
    });
    const lastRun = new Date(hist.runnedAt);

    if (new Date().getTime() - lastRun.getTime() < 24 * 60 * 60 * 1000 * 30) {
      return {
        success: true,
        runReaction: false,
      };
    }

    if (
      !this.spotify ||
      (!(await this.spotify.getIsConnected(data[0].user)) &&
        !(await this.spotify.refreshCredentials(data[0].user.id)))
    )
      return { success: false, runReaction: false };

    const resp = await fetch(
      'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userCredentials.credentials}`,
        },
      },
    );
    const resp_json = await resp.json();

    await this.prisma.automationHistory.update({
      where: {
        uuid: data[0].cronId,
      },
      data: {
        runnedAt: new Date(),
      },
    });

    const data_to_send = {
      object: 'This is your top 5 artists this month',
      message: '',
    };
    let i = 1;
    resp_json.items.forEach(async (artist: Artist) => {
      data_to_send.message += `n°${i} ${artist.name}\n`;
      i++;
    });
    return { success: true, runReaction: true, data: data_to_send };
  }
}
