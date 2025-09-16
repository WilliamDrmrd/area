import { IsInt, IsString, Length } from 'class-validator';

export class CreateAutomationDto {
  @Length(3, 25)
  @IsString()
  name: string;
  @Length(0, 1048)
  @IsString()
  description: string;

  @IsInt()
  actionId: number;

  @IsInt()
  reactionId: number;
}
