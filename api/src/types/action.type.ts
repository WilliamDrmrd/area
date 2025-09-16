import { Action, ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Option } from '.';

export interface ActionInterface {
  name: string;
  action: Option<Action>;
  execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<{
    success: boolean;
    runReaction: boolean;
    data?: any;
  }>;
  executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean>;
  saveAction(serviceId?: number): Promise<number>;
}

export abstract class ActionAbstract {
  name: string;
  action: Option<Action>;

  constructor(
    public prisma: PrismaService,
    name: string,
    private description: string,
    private additionalFields?: { [key: string]: string },
    private needAuth: boolean = false,
  ) {
    this.name = name;
    this.prisma.action
      .findFirst({
        where: { name: this.name },
      })
      .then((action) => {
        this.action = action;
      });
  }

  async executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean> {
    // if (
    //   !options['user'] ||
    //   !options['repo'] ||
    //   !data[0].data['automationId']
    // ) {
    //   throw new Error(`Missing parameters`);
    // }
    return true;
  }

  async saveAction(serviceId: number) {
    if (!this.action) {
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        throw new Error('Service not found');
      }
      this.action = await this.prisma.action.upsert({
        where: { name: this.name },
        update: {
          name: this.name,
          description: this.description,
          serviceId: service.id,
          needAuth: this.needAuth,
          additionalFields: this.additionalFields ? this.additionalFields : {},
          hasOptions: !!this.additionalFields,
        },
        create: {
          name: this.name,
          description: this.description,
          serviceId: service.id,
          needAuth: this.needAuth,
          additionalFields: this.additionalFields ? this.additionalFields : {},
          hasOptions: !!this.additionalFields,
        },
      });
      console.log(`\t${this.name} saved`);
    }
    return this.action.id;
  }
}
