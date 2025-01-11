import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports: [NatsModule],
})
export class TeamModule {}
