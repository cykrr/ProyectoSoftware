import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntry } from './calendar-entry.entity';

@Module({
  providers: [CalendarService],
  imports: [TypeOrmModule.forFeature([CalendarEntry])],
  exports: [TypeOrmModule.forFeature([CalendarEntry])],
})
export class CalendarModule {}
