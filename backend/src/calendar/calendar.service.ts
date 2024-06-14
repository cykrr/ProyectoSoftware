import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEntry } from './calendar-entry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CalendarService {
  async update(editCalendarEntryDto: {
    id: number;
    name: string;
    description: string;
    date: Date;
  }): Promise<CalendarEntry> {
    return await this.calendarRepository.save(editCalendarEntryDto);
  }
  constructor(
    @InjectRepository(CalendarEntry)
    private calendarRepository: Repository<CalendarEntry>,
  ) {}
  async create(entry: Partial<CalendarEntry>): Promise<CalendarEntry> {
    return await this.calendarRepository.create(entry);
  }
  async remove(entry: CalendarEntry): Promise<void> {
    await this.calendarRepository.remove(entry);
  }

  async find(id: number): Promise<CalendarEntry> {
    return await this.calendarRepository.findOne({ where: { id } });
  }

  async findDay(date: Date): Promise<CalendarEntry[]> {
    return await this.calendarRepository.find({ where: { date } });
  }

}
