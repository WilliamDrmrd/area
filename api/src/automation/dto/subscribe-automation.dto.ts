import { IsObject, IsOptional, IsPositive } from 'class-validator';

export type AdditionalFields = { [key: string]: string };

export class SubscribeAutomationDto {
  @IsPositive()
  actionId: number;
  @IsOptional()
  @IsObject()
  actionAdditionalFields: AdditionalFields;

  @IsPositive()
  reactionId: number;
  @IsOptional()
  @IsObject()
  reactionAdditionalFields: AdditionalFields;
}
