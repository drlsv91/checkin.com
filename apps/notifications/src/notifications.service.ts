import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });
  async notifyEmail(data: NotifyEmailDto) {
    console.log('sending notification with data =>', data);
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: data.email,
        subject: 'Reservation payment',
        text: `You payment $${data.amount} was successful`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
