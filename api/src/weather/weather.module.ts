import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { actions } from './action';
import { ActionInterface } from '../types';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [
    WeatherService,
    ...actions,
    {
      provide: 'Actions',
      useFactory: (...actions: ActionInterface[]) => actions,
      inject: actions,
    },
  ],
  exports: [WeatherService],
  imports: [PrismaModule],
})
export class WeatherModule {}
