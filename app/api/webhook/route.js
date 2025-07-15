import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key here
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription) {
  const email = subscription.metadata?.email || subscription.customer_email;
  // Check if user exists in profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  let userId = null;
  if (profile && profile.id) {
    userId = profile.id;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      subscription_id: subscription.id,
      email: email,
      subscription_plan: subscription.metadata?.subscription_plan || 'unknown',
      status: subscription.status,
      start_date: new Date(subscription.current_period_start * 1000).toISOString(),
      end_date: new Date(subscription.current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      id: userId
    });

  if (error) {
    console.error('Error creating subscription record:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      start_date: new Date(subscription.current_period_start * 1000).toISOString(),
      end_date: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription record:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      end_date: new Date(subscription.canceled_at * 1000).toISOString()
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Error canceling subscription record:', error);
    throw error;
  }
}

async function handlePaymentFailed(invoice) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due'
    })
    .eq('subscription_id', invoice.subscription);

  if (error) {
    console.error('Error updating subscription status to past_due:', error);
    throw error;
  }
} 