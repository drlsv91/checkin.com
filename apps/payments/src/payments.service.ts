import { NOTIFICATION_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configservice.get('STRIPE_SECRET_KEY'),
    { apiVersion: '2025-02-24.acacia' },
  );
  constructor(
    private readonly configservice: ConfigService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}

  async createCharge({ email, amount }: PaymentCreateChargeDto) {
    const paymentIntents = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
    });

    await this.notificationClient.emit('notify_email', { email, amount });
    return paymentIntents;
  }
}
