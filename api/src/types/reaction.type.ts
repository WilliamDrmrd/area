import { Reaction, ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Option } from '.';

export interface ReactionInterface {
  name: string;
  reaction: Option<Reaction>;
  execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean>;
  executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean>;
  saveReaction(serviceId?: number): Promise<number>;
}

export abstract class ReactionAbstract {
  name: string;
  reaction: Option<Reaction>;

  constructor(
    private prisma: PrismaService,
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
      .then((reaction) => {
        this.reaction = reaction;
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

  async saveReaction(serviceId: number) {
    if (!this.reaction) {
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        throw new Error('Service not found');
      }
      this.reaction = await this.prisma.reaction.upsert({
        where: { name: this.name },
        update: {},
        create: {
          name: this.name,
          description: this.description,
          serviceId: service.id,
          needAuth: this.needAuth,
          additionalFields: !this.additionalFields ? {} : this.additionalFields,
          hasOptions: !!this.additionalFields,
        },
      });
      console.log(`\t${this.name} saved`);
    }
    return this.reaction.id;
  }
}
