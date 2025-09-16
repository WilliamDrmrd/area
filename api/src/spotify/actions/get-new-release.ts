import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionAbstract, ActionInterface, Option } from '../../types';
import { SpotifyService } from '../spotify.service';
import { Album, Artist } from '../../types/spotifyTypes';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class GetNewRelease extends ActionAbstract implements ActionInterface {
  spotify: SpotifyService;
  constructor(prisma: PrismaService) {
    super(prisma, 'Get-new-release', 'Get new releases', {
      uri: 'The spotify link to the artist',
    });
  }

  async executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean> {
    if (!userCredentials || !userCredentials.credentials || !options['uri']) {
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

    try {
      const response = await fetch(options['uri'], {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userCredentials.credentials}`,
        },
      });

      if (response.status != 200) return false;

      return true;
    } catch (e) {
      return false;
    }
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

    if (
      !this.spotify ||
      (!(await this.spotify.getIsConnected(data[0].user)) &&
        !(await this.spotify.refreshCredentials(data[0].user.id)))
    )
      return { success: false, runReaction: false };

    const hist = await this.prisma.automationHistory.findFirst({
      where: {
        uuid: data[0].cronId,
      },
    });
    const lastRun = new Date(hist.runnedAt);

    if (new Date().getTime() - lastRun.getTime() < 24 * 60 * 60 * 1000) {
      return {
        success: true,
        runReaction: false,
      };
    }

    const artist_id = options['uri'].split('/artist/')[1];
    const getNewReleases = (albums: Album[]) => {
      let a: any;
      albums.forEach((album: Album) => {
        album.artists.forEach((artist: Artist) => {
          if (artist.id == artist_id) {
            a = {
              object: 'New Album !',
              message: `New album from ${artist.name} ! ${album.name}`,
              date: album.release_date,
            };
            return;
          }
          if (a) return;
        });
      });
      return a;
    };

    let test: any;
    let json_test: any;
    let next = 'https://api.spotify.com/v1/browse/new-releases?limit=50';
    let alb: any;

    for (let i = 0; i < 10; i++) {
      test = await fetch(next, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userCredentials.credentials}`,
        },
      });
      if (test.status != 200) return { success: true, runReaction: false };
      json_test = await test.json();
      alb = getNewReleases(json_test.albums.items);
      if (alb) break;
      next = json_test.albums.next;
      if (!next) break;
    }

    if (!alb) return { success: true, runReaction: false };

    await this.prisma.automationHistory.update({
      where: {
        uuid: data[0].cronId,
      },
      data: {
        runnedAt: new Date(),
      },
    });
    return { success: true, runReaction: true, data: alb };
  }
}
