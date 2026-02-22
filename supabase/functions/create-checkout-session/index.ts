const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const VALID_PRICE_IDS = new Set([
  'price_1T3Cqd2NA0ttIOr0ndAG6xqA',
  'price_1T3Cr12NA0ttIOr0adcLLIXl',
  'price_1T3IZg2NA0ttIOr0DodJ00dP',
  'price_1T3CrJ2NA0ttIOr0PPxXPmVO',
  'price_1T3Ia92NA0ttIOr0tqhYiiM1',
  'price_1T3Cri2NA0ttIOr0HUjHQLJF',
  'price_1T3Iac2NA0ttIOr0oP6MsKev',
]);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { priceId, email } = await req.json();
    console.log('Checkout request - email:', email || 'NOT PROVIDED');

    if (!priceId || !VALID_PRICE_IDS.has(priceId)) {
      return new Response(JSON.stringify({ error: 'Invalid price ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripeKey = Deno.env.get('STRIPE_API_KEY');
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const origin = req.headers.get('origin') || 'https://hobson-21.lovable.app';

    // Look up existing Stripe customer by email
    let customerId: string | null = null;
    if (email) {
      const searchParams = new URLSearchParams({ email, limit: '1' });
      const customerRes = await fetch(`https://api.stripe.com/v1/customers?${searchParams}`, {
        headers: { 'Authorization': `Bearer ${stripeKey}` },
      });
      const customerData = await customerRes.json();
      if (customerRes.ok && customerData.data?.length > 0) {
        customerId = customerData.data[0].id;
        console.log('Found existing Stripe customer:', customerId);
      }
    }

    const body = new URLSearchParams({
      'mode': 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': `${origin}?checkout=success`,
      'cancel_url': `${origin}?checkout=cancelled`,
    });

    if (customerId) {
      body.set('customer', customerId);
    } else if (email) {
      body.set('customer_email', email);
    }

    console.log('Stripe params - customer:', customerId || 'NONE', 'customer_email:', !customerId && email ? email : 'NONE');

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe error:', session);
      return new Response(JSON.stringify({ error: session.error?.message || 'Stripe error' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
