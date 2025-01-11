import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TeamService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }
  onModuleInit() {
    this.$connect();
  }
  // Crear un equipo

  async create(createTeamDto: CreateTeamDto) {
    try {
      const team = await this.team.create({
        data: createTeamDto,
      });
      return team;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.team.count();

    const lastPages = Math.ceil(totalPages / limit);

    return {
      data: await this.team.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPages: totalPages,
        page: page,
        lastPages: lastPages,
      },
    };
  }

  async findOne(id: string) {
    try {
      const team = await this.team.findUnique({
        where: { id },
        include: { members: true },
      });
      if (!team) {
        throw new RpcException('Team not found');
      }
      return team;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      await this.findOne(id);
      return this.team.update({
        where: { id },
        data: updateTeamDto,
      });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string) {
    try {
      const team = await this.findOne(id);
      if (!team) {
        throw new RpcException('Team not found');
      }
      return this.team.delete({
        where: { id },
      });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async addMember(teamId: string, userId: string, role: string) {
    try {
      const userExist = await firstValueFrom(
        this.client.send({ cmd: 'find_one_user' }, { id: userId }),
      );

      console.log('existe', userExist);

      await this.findOne(teamId);

      const memberExists = await this.teamMember.findUnique({
        where: { userId_teamId: { userId, teamId } },
      });
      if (memberExists) {
        throw new RpcException('Member already exists in the team');
      }
      return this.teamMember.create({
        data: { teamId, userId, role },
      });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findMembers(teamId: string) {
    try {
      return this.teamMember.findMany({
        where: { teamId },
        include: { team: true },
      });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async removeMember(teamId: string, memberId: string) {
    try {
      const member = await this.teamMember.findUnique({
        where: { id: memberId },
      });
      if (!member || member.teamId !== teamId) {
        throw new RpcException('Member not found in the specified team');
      }
      return this.teamMember.delete({
        where: { id: memberId },
      });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
