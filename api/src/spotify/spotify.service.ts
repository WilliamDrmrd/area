import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceProvider, ReactionInterface, ActionInterface } from '../types';
import { PrismaService } from '../prisma/prisma.service';
import { Service, User } from '@prisma/client';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Album, Artist } from '../types/spotifyTypes';

@Injectable()
export class SpotifyService implements ServiceProvider {
  spotify: Service | undefined;
  name = 'Spotify';
  description = 'Spotify Service';
  authUri = '';
  registeredActions: Map<number, ActionInterface> = new Map<
    number,
    ActionInterface
  >();
  registeredReactions: Map<number, ReactionInterface> = new Map<
    number,
    ReactionInterface
  >();
  stateRandomStrings: Map<number, string> = new Map<number, string>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject('Actions') private actions: ActionInterface[],
  ) {}

  //===========//
  //  SERVICE  //
  //===========//

  async saveService() {
    this.spotify = await this.prisma.service.upsert({
      where: { name: this.name },
      update: {
        isOAuth: true,
      },
      create: {
        name: this.name,
        description: this.description,
        isOAuth: true,
      },
    });
    console.log(`${this.name} saved`);
  }

  //===========//
  //  ACTIONS  //
  //===========//

  async saveActions() {
    if (!this.spotify) throw new Error('Spotify service not saved');

    console.log('Spotify Actions:');
    const promises = this.actions.map(async (action: ActionInterface) => {
      const id = await action.saveAction(this.spotify.id);
      this.registeredActions.set(id, action);
    });
    await Promise.all(promises);
    return this.registeredActions;
  }

  loadActions(): Map<number, ActionInterface> {
    return this.registeredActions;
  }

  //=============//
  //  REACTIONS  //
  //=============//

  async saveReactions(): Promise<Map<number, ReactionInterface>> {
    return new Map<number, ReactionInterface>();
  }

  loadReactions(): Map<number, ReactionInterface> {
    return this.registeredReactions;
  }

  //==================//
  //  AUTHENTICATION  //
  //==================//

  authenticate(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async getIsConnected(user: User) {
    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: user.id,
        serviceId: this.spotify.id,
      },
    });

    if (!actionServiceCreds) return false;

    try {
      const resp = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${actionServiceCreds.credentials}`,
        },
      });
      if (resp.status != 200) return false;
    } catch (error) {
      console.error('getIsConnected Spotify, Request Error :', error);
      return false;
    }
    return true;
  }

  getAuthData(user: User) {
    this.stateRandomStrings.set(user.id, randomStringGenerator());
    const link = 'https://accounts.spotify.com/authorize';
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const scope =
      'user-follow-read ' +
      'user-follow-modify ' +
      'user-read-email ' +
      'playlist-read-private ' +
      'playlist-read-collaborative ' +
      'user-read-currently-playing ' +
      'user-library-read ' +
      'user-top-read';
    const state = this.stateRandomStrings.get(user.id);

    this.authUri = `${link}?client_id=${encodeURIComponent(
      clientId,
    )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;

    return {
      link,
      clientId,
      scope,
      state,
      responseType: 'code',
      redirectUri: 'http://127.0.0.1:8081/oauthredirect',
    };
  }

  async applyOAuth(user: User, body: any): Promise<any> {
    const newBody = new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: body.redirectUri
        ? body.redirectUri
        : 'http://127.0.0.1:8081/oauthredirect',
      code: body.code,
    });

    const resp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: newBody,
    });

    if (!resp) throw new NotFoundException('Error while fetching token');
    const respBody = await resp.json();

    const today = new Date();
    const oneHourFromNow = new Date(today);
    oneHourFromNow.setHours(today.getHours() + 1);

    const credentials = await this.prisma.servicesCredentials.upsert({
      where: {
        serviceId_userId: {
          serviceId: this.spotify.id,
          userId: user.id,
        },
      },
      update: {
        validUntil: oneHourFromNow,
        credentials: respBody.access_token,
        refreshToken: respBody.refresh_token,
      },
      create: {
        validUntil: oneHourFromNow,
        credentials: respBody.access_token,
        refreshToken: respBody.refresh_token,
        serviceId: this.spotify.id,
        userId: user.id,
      },
    });

    if (!credentials)
      throw new NotFoundException('Error while saving credentials');

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        serviceCredentials: {
          connect: {
            id: credentials.id,
          },
        },
      },
    });

    if (updatedUser)
      return {
        message: 'Success',
        status: 200,
      };
    else throw new NotFoundException('Error while saving credentials in user');
  }

  async refreshCredentials(id: number) {
    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: id,
        serviceId: this.spotify.id,
      },
    });

    const resp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: actionServiceCreds.refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
      }),
    });

    if (!resp) throw new NotFoundException('Error while fetching token');
    if (resp.status != 200) return false;

    try {
      const updated = await this.prisma.servicesCredentials.update({
        where: {
          id: actionServiceCreds.id,
        },
        data: {
          credentials: (await resp.json()).access_token,
        },
      });
      if (!updated) return false;
    } catch (error) {
      console.error('refreshCredentials Spotify, Erreur de requête :', error);
    }
  }
}
