import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern({ cmd: 'create_team' })
  create(@Payload() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @MessagePattern({ cmd: 'find_all_teams' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.teamService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_one_team' })
  findOne(@Payload() id: string) {
    return this.teamService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_team' })
  update(@Payload() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(updateTeamDto.id, updateTeamDto);
  }

  @MessagePattern({ cmd: 'remove_team' })
  remove(@Payload() id: string) {
    return this.teamService.remove(id);
  }

  @MessagePattern({ cmd: 'add_member' })
  addMember(@Payload() data: { teamId: string; userId: string; role: string }) {
    return this.teamService.addMember(data.teamId, data.userId, data.role);
  }

  @MessagePattern({ cmd: 'find_members' })
  findMembers(@Payload() teamId: string) {
    return this.teamService.findMembers(teamId);
  }

  @MessagePattern({ cmd: 'remove_member' })
  removeMember(@Payload() data: { teamId: string; memberId: string }) {
    return this.teamService.removeMember(data.teamId, data.memberId);
  }
}
