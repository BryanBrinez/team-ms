import { Module } from '@nestjs/common';
import { TeamModule } from './team/team.module';

@Module({
  imports: [TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
