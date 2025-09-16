import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto, SubscribeAutomationDto } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('automations')
export class AutomationController {
  constructor(private automation: AutomationService) {}

  @Get()
  getAutomations(@GetUser() user: User) {
    return this.automation.getAutomations(user);
  }

  @Get('subscribed')
  getSubscribedAutomations(@GetUser() user: User) {
    return this.automation.getSubscribedAutomations(user);
  }

  @Get(':id')
  getAutomation(@Param('id', ParseIntPipe) id: number) {
    return this.automation.getAutomation(id);
  }

  @HttpCode(200)
  @Post('create')
  createAutomation(@GetUser() user: User, @Body() dto: CreateAutomationDto) {
    return this.automation.createAutomation(user, dto);
  }

  @HttpCode(200)
  @Post(':id/subscribe')
  subscribeToAutomation(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() dto: SubscribeAutomationDto,
  ) {
    return this.automation.subscribeToAutomation(id, user, dto);
  }

  @Get(':id/unsubscribe')
  unsubscribeFromAutomation(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.automation.unsubscribeToAutomation(id, user);
  }

  @HttpCode(200)
  @Delete(':id')
  deleteAutomation(@Param('id', ParseIntPipe) id: number) {
    return this.automation.deleteAutomation(id);
  }
}
