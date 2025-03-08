import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma.service'; // Asegúrate de que este es tu servicio de Prisma

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getEvents(userId: string) {
    // Obtener el token de acceso desde la base de datos
    const userToken = await this.prisma.userToken.findUnique({
      where: { userId },
      select: { accessToken: true },
    });

    if (!userToken || !userToken.accessToken) {
      throw new Error('No access token found for user');
    }

    // Crear un cliente de Google Calendar con el token del usuario
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: userToken.accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    // Fecha de inicio de hoy (00:00:00)
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Fecha de fin de mañana (23:59:59)
    const endOfTomorrow = new Date(now);
    endOfTomorrow.setDate(now.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    try {
      const response = await calendar.events.list({
        calendarId: 'primary', // El calendario principal del usuario
        timeMin: startOfToday.toISOString(),
        timeMax: endOfTomorrow.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Error fetching calendar events');
    }
  }
}
