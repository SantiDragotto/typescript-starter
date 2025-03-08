import { Controller, Get, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get(':userId/events')
  async getEvents(@Param('userId') userId: string) {
    return this.calendarService.getEvents(userId);
  }
}
