import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { price, billing_cycle, email } = await request.json();
    const amount = Math.round(Number(price) * 100);
    const interval = billing_cycle === 'monthly' ? 'month' : 'year';
    const planName = `pro_${billing_cycle}`;
    
    // Get site URL from environment or use a fallback
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thepathcompany.com';

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
      metadata: {
        email: email,
        subscription_plan: planName,
        billing_cycle: billing_cycle
      },
      success_url: `${siteUrl}/signup?email=${encodeURIComponent(email)}&success=true`,
      cancel_url: `${siteUrl}/plans?canceled=true`
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 