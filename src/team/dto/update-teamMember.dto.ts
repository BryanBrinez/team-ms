import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamMemberDto } from './create-teamMember.dto';

export class UpdateTeamDto extends PartialType(CreateTeamMemberDto) {}
