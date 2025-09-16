import { Module } from '@nestjs/common';
import { Web3isDoingGreatService } from './web3is-doing-great.service';
import { actions } from './action';
import { ActionInterface } from '../types';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [
    Web3isDoingGreatService,
    ...actions,
    {
      provide: 'Actions',
      useFactory: (...actions: ActionInterface[]) => actions,
      inject: actions,
    },
  ],
  exports: [Web3isDoingGreatService],
  imports: [PrismaModule],
})
export class Web3isDoingGreatModule {}
