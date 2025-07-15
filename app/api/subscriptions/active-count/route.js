import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key here
);

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching active subscription count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      active_count: count || 0
    });

  } catch (error) {
    console.error('Active count error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 