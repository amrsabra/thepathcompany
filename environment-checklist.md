# Environment Variables Checklist

## Required for Vercel Deployment

### Supabase Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase service role key (keep secret!)

### Stripe Variables
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (starts with `sk_`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook endpoint signing secret

### Site Configuration
- [ ] `NEXT_PUBLIC_SITE_URL` - Your deployed site URL (e.g., `https://your-app.vercel.app`)

## How to Set in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the correct name and value
5. Deploy to apply changes

## Security Notes

- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Keep this secret, never expose to client
- ✅ `STRIPE_SECRET_KEY` - Keep this secret, never expose to client  
- ✅ `STRIPE_WEBHOOK_SECRET` - Keep this secret, never expose to client
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose (used in client)
- ✅ `NEXT_PUBLIC_SITE_URL` - Safe to expose (used in client)

## Testing

After setting variables:
1. Deploy to Vercel
2. Test the subscription flow
3. Check Vercel function logs for any errors
4. Verify webhook events are received 