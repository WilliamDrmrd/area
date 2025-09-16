import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { actions } from './actions';
import { reactions } from './reactions';
import { ActionInterface, ReactionInterface } from '../types';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [
    GithubService,
    ...actions,
    {
      provide: 'Actions',
      useFactory: (...actions: ActionInterface[]) => actions,
      inject: actions,
    },
    ...reactions,
    {
      provide: 'Reactions',
      useFactory: (...reactions: ReactionInterface[]) => reactions,
      inject: reactions,
    },
  ],
  controllers: [GithubController],
  imports: [PrismaModule],
  exports: [GithubService],
})
export class GithubModule {}
