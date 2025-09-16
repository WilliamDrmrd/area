
#### 1. Create the new module and the service

```bash
nest g module <name> && nest g service <name>
```

#### 2. Copy the content of an other module (like Github module):

The service should implement this interface.
You should look at the other services for a good example.

```typescript
import { ReactionInterface } from './reaction.type';
import { ActionInterface } from './action.type';

export type Option<T> = T | undefined;
export type CanBeAsync<T> = T | Promise<T>;

export interface ServiceProvider {
  name: string;
  description: string;

  saveService(): CanBeAsync<void>;
  saveActions(): CanBeAsync<Map<number, ActionInterface>>;
  saveReactions(): CanBeAsync<Map<number, ReactionInterface>>;

  loadActions(): CanBeAsync<Map<number, ActionInterface>>;
  loadReactions(): CanBeAsync<Map<number, ReactionInterface>>;

  authenticate(): CanBeAsync<boolean>;
}
```

#### 4. Add you actions and reactions:

I. Create a folder named actions inside your module and do the same for reactions

!!! the service may or may not have both actions and reactions. !!!
`src/weather/`
```
.
├── action
│   ├── cold-temp.ts
│   ├── hot-temp.ts
│   ├── index.ts
│   └── rain.ts
├── weather.module.ts
├── weather.service.spec.ts
└── weather.service.ts
```

II. Create the `index.ts` like in the example and import you actions and reaction inside it.

export an array of classes inside it like so:

`src/weather/actions/index.ts`
```ts
import { ColdTemp } from './cold-temp';
import { HotTemp } from './hot-temp';
import { Rain } from './rain';

export const actions = [ColdTemp, HotTemp, Rain];
```

III. Now you need to create the provider array in the module :
```ts
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
    // same for reactions but with the corresponding type
  ],
  exports: [WeatherService],
  imports: [PrismaModule],
})
export class WeatherModule {}
```

IV. You can now inject your actions and reactions inside the service constructor:

```ts
// ....

constructor(
  private prisma: PrismaService,
  // you now have you actions / reactions array
  @Inject('Actions') private actions: ActionInterface[], 
  // same for reactions but with the corresponding types and name.
) {}

// ....
```

V. Finally you can implement the actions / reactions:

actions and reactions must extend their respective abstract class and implement the interface.

`src/wearther/actions/hot-temp.ts`
```ts
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
export class HotTemp extends ActionAbstract implements ActionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'Hot-temp', 'when temp get hot (>= 30)');
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
	  // implementation
  }
}

```

The `userCredentials` has the required credential token for your service.

The `options` are optional but can be declared in the `super()` function of the actions / reactions for additional user input. 

`src/discord/reactions/send-message.ts`
```ts*
// ....

constructor(prisma: PrismaService) {
    super(prisma, 'Send-Message', 'Send-Message', { 
	  // name of the param and descrition (for errors )
      webhook: 'the webhook you want to send to', 
    });
    
  }
  
// ....
```

The object passed as parameter will be required when subscribing to an action / reaction .
Here the reaction require a webhook from the user to send messages to a channel.

Inside `data[0]`:
- `data[0].user` : the user his ID dans infos.
- `data[0].cronId` : the ID of the Cron that will be run the action / reactions
#### 5. Add the module to the `src/app.module` file if not added:

```typescript
import { Global, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
// ... other modules
import { NameModule } from '../name/name.module';

@Global()
@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports: [
    // ... other modules
    NameModule,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}


```

#### 6. Export your service from the module like so :

```typescript
import { NameService } from './name.service';

@Module({
  controllers: [...],
  providers: [...],
  exports: [NameService], // the service is now available for other modules
  imports: [...],
})
export class DiscordModule {}

```

#### 7. add the service to the `ServicesService` so it can be saved:

I. Import your service module in the `ServicesModule`

`src/services/services.module.ts`
```ts
import { Global, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
// ... other services
import { NameModule } from '../name/name.module';

@Global()
@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports: [
    // ... other services
    NameModule,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}

```

II. Inside the constructor of the `ServicesService` add your service :

`src/services/services.service.ts ~L38`
```typescript
// ....

@Injectable()
export class ServicesService implements OnApplicationBootstrap {
  actions: ServiceActions;
  reactions: ServiceReactions;
  services: Map<name, ServiceProvider>;
  initializationEmitter = new EventEmitter()

  constructor(
    // ... other services
    private slackService: SlackService,
    private prisma: PrismaService,
    private nameService: nameService,
) {
    this.actions = new Map<number, ActionInterface>();
    this.reactions = new Map<number, ReactionInterface>();
    this.services = new Map<name, ServiceProvider>();

    // ... other services
    this.services.set(discordService.name, discordService as ServiceProvider);
    this.services.set(slackService.name, slackService as ServiceProvider);

	// like so :
	this.services.set(nameService.name, nameService as ServiceProvider);
  }
  
// ....
```

III. Add the service to the save sequence :

`src/services/services.service.ts ~L90`
```ts
// ....

async saveServices() {
    const saveToActions = (map: ServiceActions) => {
      map.forEach((action, key) => {
        this.actions.set(key, action);
      });
    };
    const saveToReactions = (map: ServiceReactions) => {
      map.forEach((reaction, key) => {
        this.reactions.set(key, reaction);
      });
    };

    // ... other services
    await this.nameService.saveService();

// ....
```

IV. Finally save the actions and reactions of your service :

`src/services/services.service.ts ~L100`
```ts
   // get actions in const
    // ... other services actions
    const nameActions = await this.nameService.saveActions();

	// ... other service reactions
    const nameReactions = await this.nameService.saveReactions();

    // ... other services reactions
    saveToActions(nameActions);
    // ... other services actions
    saveToReactions(nameReactions);
```

#### 7. Implement these methods if you are creating a service that require some  `oAuth authentication` :

I. First, implement the method used to get the authentication link for the user :

`src/service/service.service.ts ~L115`
```ts
// ....
  getAuthData(user: User) {
    this.stateRandomStrings.set(user.id, randomStringGenerator());
    const link =  // ...  link to authenticate the user to the service;
    const clientId = // ... client id of the service;
    const scope = // ... scope of the service;
    const state = this.stateRandomStrings.get(user.id);

    this.authUri = `${link}?client_id=${encodeURIComponent(
      clientId,
    )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;

    return {
      link,
      clientId,
      scope,
      state,
      responseType: // ... response type of the service,
      redirectUri: // ... redirect uri of the service,
    };
  }
// ....
```

II. Then implement the method used to save the user credentials to the service :

`src/service/service.service.ts ~L135`
```ts
// ....
  async applyOAuth(user: User, body: any): Promise<any> {
    const newBody = new URLSearchParams({
      grant_type: // ... grant type of the service,
      redirect_uri: body.redirectUri
        ? body.redirectUri
        : // ... redirect uri of the service,
      code: body.code,
    });

    const resp = // ... request to get the token of the user;
    });

    if (!resp) throw new NotFoundException('Error while fetching token');
    const respBody = await resp.json();

    const today = new Date();
    const tokenValidationTime = new Date(today);
    // ... set the token validation time;

    const credentials = await this.prisma.servicesCredentials.upsert({
      where: {
        serviceId_userId: {
          serviceId: this.service.id,
          userId: user.id,
        },
      },
      update: {
        validUntil: tokenValidationTime,
        credentials: respBody.access_token,
        refreshToken: respBody.refresh_token,
      },
      create: {
        validUntil: tokenValidationTime,
        credentials: respBody.access_token,
        refreshToken: respBody.refresh_token,
        serviceId: this.service.id,
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
// ....
```

III. Finally implement the the method used to check if the user is connected to the service :


`src/service/service.service.ts ~L95`
```ts
// .... 
  async getIsConnected(user: User) {
    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: user.id,
        serviceId: this.service.id,
      },
    });

    if (!actionServiceCreds) return false;

    try {
    // ... implement the request to check if the user is connected to the service
      };
      if (resp.status != 200) return false;
    } catch (error) {
      console.error('getIsConnected Service, Request Error :', error);
      return false;
    }
    return true;
  }
```
