import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';
import { IsString } from 'class-validator';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @IsString()
  id: string;
}
