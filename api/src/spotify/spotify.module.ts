import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { actions } from './actions';
import { ActionInterface } from '../types';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [
    SpotifyService,
    ...actions,
    {
      provide: 'Actions',
      useFactory: (...actions: ActionInterface[]) => actions,
      inject: actions,
    },
  ],
  exports: [SpotifyService],
  imports: [PrismaModule],
  controllers: [SpotifyController],
})
export class SpotifyModule {}
