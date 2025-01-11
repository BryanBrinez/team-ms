import { IsString } from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  userId: string;

  @IsString()
  teamId: string;

  @IsString()
  role: string;
}
