import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getUserEvents(userId: string) {
    const userToken = await this.prisma.userToken.findUnique({ where: { userId } });
    if (!userToken) throw new Error('No token found for user');

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: userToken.accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const events = await calendar.events.list({ calendarId: 'primary', maxResults: 10 });

    return events.data.items;
  }
}