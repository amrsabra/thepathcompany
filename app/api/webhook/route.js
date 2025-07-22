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
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
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

// Helper to safely convert Stripe timestamps to ISO strings
function safeToISOString(timestamp) {
  if (typeof timestamp === 'number' && !isNaN(timestamp)) {
    return new Date(timestamp * 1000).toISOString();
  }
  return null;
}

async function handleCheckoutSessionCompleted(session) {
  console.log('checkout.session.completed payload:', session);
  const email = session.customer_email || session.metadata?.email;
  const subscription_id = session.subscription;
  const plan = session.metadata?.subscription_plan || 'unknown';
  const billing_cycle = session.metadata?.billing_cycle || null;

  // Fetch the subscription from Stripe to get start/end dates and status
  let subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(subscription_id);
    console.log('Fetched subscription from Stripe:', subscription);
    // Log the period start and end
    console.log('Stripe current_period_start:', subscription.current_period_start);
    console.log('Stripe current_period_end:', subscription.current_period_end);
  } catch (err) {
    console.error('Error fetching subscription from Stripe:', err);
    throw err;
  }

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

  // If start_date or end_date is null, set them based on plan
  let startDate = safeToISOString(subscription.current_period_start);
  let endDate = safeToISOString(subscription.current_period_end);
  if (!startDate) {
    startDate = new Date().toISOString();
  }
  if (!endDate) {
    if (plan === 'pro_monthly') {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + 1);
      endDate = d.toISOString();
    } else if (plan === 'pro_yearly') {
      const d = new Date(startDate);
      d.setFullYear(d.getFullYear() + 1);
      endDate = d.toISOString();
    }
  }

  const insertData = {
    subscription_id: subscription.id,
    email: email,
    subscription_plan: plan,
    status: subscription.status,
    start_date: startDate,
    end_date: endDate,
    created_at: new Date().toISOString(),
    user_id: userId // <-- use user_id, not id
  };

  // Log the data to be inserted
  console.log('Prepared insertData for subscriptions:', insertData);

  const { error } = await supabase
    .from('subscriptions')
    .insert(insertData);

  if (error) {
    console.error('Error creating subscription record:', error);
    throw error;
  } else {
    console.log('Subscription record created successfully');
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