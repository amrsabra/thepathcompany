# Subscription Flow Testing Guide

## Prerequisites
- All environment variables set in Vercel
- Stripe webhook endpoint configured
- Supabase RLS policies applied

## Test Scenarios

### 1. Guest User Purchase Flow
1. Visit `/plans` while not logged in
2. Click "Get Premium Access"
3. Enter email in prompt modal
4. Complete Stripe checkout
5. Verify redirect to `/signup?email=test@example.com&success=true`
6. Verify email field is pre-filled and read-only
7. Complete signup form
8. Verify subscription is linked to user profile

### 2. Logged-in User Purchase Flow
1. Sign in to account
2. Visit `/plans`
3. Click "Get Premium Access"
4. Verify direct redirect to Stripe (no email prompt)
5. Complete payment
6. Verify redirect to `/signup?email=user@example.com&success=true`
7. Verify subscription linking works

### 3. Webhook Testing
1. Use Stripe CLI to test webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
2. Create test subscription in Stripe dashboard
3. Verify subscription record created in Supabase
4. Update subscription status in Stripe
5. Verify status updated in Supabase

### 4. API Endpoint Testing
1. Test `/api/subscriptions/active-count`:
   ```bash
   curl https://your-domain.vercel.app/api/subscriptions/active-count
   ```
2. Test `/api/link-subscription-to-profile`:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/link-subscription-to-profile \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","userId":"user-uuid"}'
   ```

## Expected Results
- Guest users can purchase subscriptions
- Email pre-filling works correctly
- Subscription linking works after signup
- Webhooks update subscription status
- All API endpoints return correct responses

## Troubleshooting
- Check Vercel function logs for errors
- Verify environment variables are set correctly
- Test webhook signature verification
- Check Supabase RLS policies 