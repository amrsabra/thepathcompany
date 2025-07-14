import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { price, billing_cycle, email } = await request.json();
    const amount = Math.round(Number(price) * 100);
    const interval = billing_cycle === 'monthly' ? 'month' : 'year';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `TPC Premium (${billing_cycle.charAt(0).toUpperCase() + billing_cycle.slice(1)})` },
          unit_amount: amount,
          recurring: { interval }
        },
        quantity: 1
      }],
      customer_email: email,
      success_url: 'https://www.thepathcompany.com/plans?success=true',
      cancel_url: 'https://www.thepathcompany.com/plans?canceled=true'
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 