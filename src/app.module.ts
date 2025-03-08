import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { CalendarService } from './calendar/calendar.service';
import { CalendarController } from './calendar/calendar.controller';

@Module({
  imports: [ClientesModule, AuthModule],
  controllers: [AppController, CalendarController],
  providers: [AppService, PrismaService, CalendarService],
  exports: [PrismaService]
})
export class AppModule {}
