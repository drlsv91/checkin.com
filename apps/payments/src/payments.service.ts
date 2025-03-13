import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configservice.get('STRIPE_SECRET_KEY'),
    { apiVersion: '2025-02-24.acacia' },
  );
  constructor(private readonly configservice: ConfigService) {}

  async createCharge({ card, amount }: CreateChargeDto) {
    const paymentIntents = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
    });
    return paymentIntents;
  }
}
