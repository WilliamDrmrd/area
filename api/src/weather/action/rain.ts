import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ActionAbstract,
  ActionInterface,
  Option,
  WeatherElement,
} from '../../types';
import { formatDate } from '../../utils/dateformat';

@Injectable()
export class Rain extends ActionAbstract implements ActionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'Rain', 'When weather is wet');
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
    const hist = await this.prisma.automationHistory.findFirst({
      where: {
        uuid: data[0].cronId,
      },
    });
    const lastRun = new Date(hist.runnedAt);

    if (new Date().getTime() - lastRun.getTime() < 24 * 60 * 60 * 1000) {
      return { success: true, runReaction: false };
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=33.44&lon=-94.04&units=metric&appid=${process.env.WEATHER_API}`;
    const action_return: {
      success: boolean;
      runReaction: boolean;
      data: { [key: string]: string };
    } = {
      success: false,
      runReaction: false,
      data: undefined,
    };
    const resp = await fetch(url);
    if (!resp.ok) return action_return;
    const respData = resp.json();
    const listObj = new Map<string, WeatherElement>();
    action_return.success = true;

    (await respData).list.forEach((item: WeatherElement) => {
      listObj.set(item.dt_txt, item);
    });
    const nine = listObj.get(formatDate(new Date(), 9));
    const fifteen = listObj.get(formatDate(new Date(), 15));
    if (nine?.rain || fifteen?.rain) {
      await this.prisma.automationHistory.update({
        where: {
          uuid: data[0].cronId,
        },
        data: {
          runnedAt: new Date(),
        },
      });
      return {
        success: true,
        runReaction: true,
        data: {
          message: `tomorrow gonna be rainy`,
          object: 'tomorrow gonna be rainy',
        },
      };
    }
    return action_return;
  }
}
