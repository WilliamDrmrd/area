import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionAbstract, ActionInterface, Option } from '../../types';
import { SpotifyService } from '../spotify.service';
import { Album, Artist } from '../../types/spotifyTypes';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class GetFollowedNewRelease
  extends ActionAbstract
  implements ActionInterface
{
  spotify: SpotifyService;
  constructor(prisma: PrismaService) {
    super(
      prisma,
      'Get-followed-new-release',
      'Get new releases by followed artists',
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

    const resp = await fetch(
      'https://api.spotify.com/v1/me/following?type=artist',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userCredentials.credentials}`,
        },
      },
    );
    const resp_json = await resp.json();

    const getNewReleases = (albums: Album[], artist_id: string) => {
      let a: any;
      albums.forEach((album: Album) => {
        album.artists.forEach((artist: Artist) => {
          if (artist.id == artist_id) {
            a = {
              artist: artist.name,
              album: album.name,
              link: album.external_urls.spotify,
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
    const alb = [];

    for (let i = 0; i < 10; i++) {
      test = await fetch(next, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userCredentials.credentials}`,
        },
      });
      if (test.status != 200) return { success: true, runReaction: false };
      json_test = await test.json();
      resp_json.artists.items.forEach((artist: any) => {
        const realeases = getNewReleases(json_test.albums.items, artist.id);
        realeases ? alb.push(realeases) : null;
      });
      next = json_test.albums.next;
      if (!next) break;
    }

    const data_to_send = {
      object: '',
      message: '',
    };
    for (let i = 0; i < alb.length; i++) {
      if ((i == alb.length - 1 && i < 4) || (i >= 3 && i < 4)) {
        data_to_send.object += `${alb[i].artist} and many more released a new album !`;
      } else if (i < 4) {
        data_to_send.object += `${alb[i].artist}, `;
      }
      data_to_send.message =
        `${data_to_send.message}${alb[i].artist} released a new album ! ` +
        `${alb[i].album} on ${alb[i].date}\n${alb[i].link}\n\n}`;
    }
    if (alb.length == 0) return { success: true, runReaction: false };

    await this.prisma.automationHistory.update({
      where: {
        uuid: data[0].cronId,
      },
      data: {
        runnedAt: new Date(),
      },
    });
    return { success: true, runReaction: true, data: data_to_send };
  }
}
