import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Get } from '@nestjs/common';

@Controller('services')
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Get()
  async getServices() {
    return this.services.getServices();
  }

  @Get(':id')
  async getService(@Param('id', ParseIntPipe) id: number) {
    return this.services.getServiceDb(id);
  }

  @Get(':id/actions')
  async getServiceActions(@Param('id', ParseIntPipe) id: number) {
    return this.services.getServiceActions(id);
  }

  @Get(':id/reactions')
  async getServiceReactions(@Param('id', ParseIntPipe) id: number) {
    return this.services.getServiceReactions(id);
  }

  @Get(':id/automations')
  async getServiceAutomations(@Param('id', ParseIntPipe) id: number) {
    return this.services.getServiceAutomations(id);
  }
}
