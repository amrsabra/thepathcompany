import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key here
);

export async function POST(request) {
  try {
    const { email, userId } = await request.json();

    const normalizedEmail = email.trim().toLowerCase();
    console.log('Linking subscription to profile:', { email: normalizedEmail, userId });

    if (!normalizedEmail || !userId) {
      return NextResponse.json(
        { error: 'Email and userId are required' },
        { status: 400 }
      );
    }

    // Find subscription with matching email and null user_id
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', normalizedEmail)
      .is('user_id', null)
      .maybeSingle();

    console.log('Found subscription:', subscription);

    if (fetchError) {
      console.error('Error fetching subscription:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    if (!subscription) {
      // Log all subscriptions for this email for debugging
      const { data: allSubs, error: allSubsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', normalizedEmail);
      console.log('All subscriptions for email:', allSubs);
      return NextResponse.json(
        { error: 'No unlinked subscription found for this email' },
        { status: 404 }
      );
    }

    // Update subscription with user ID
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ user_id: userId })
      .eq('subscription_id', subscription.subscription_id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to link subscription to profile' },
        { status: 500 }
      );
    } else {
      console.log('Subscription linked successfully:', subscription.subscription_id);
    }

    return NextResponse.json({
      message: 'Subscription linked successfully',
      subscription_id: subscription.subscription_id
    });

  } catch (error) {
    console.error('Link subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 