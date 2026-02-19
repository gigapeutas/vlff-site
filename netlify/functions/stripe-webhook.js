const Stripe = require("stripe");

exports.handler = async (event) => {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return { statusCode: 500, body: "Env vars ausentes (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)" };
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const sig = event.headers["stripe-signature"];
  if (!sig) return { statusCode: 400, body: "Missing stripe-signature" };

  let evt;
  try{
    evt = stripe.webhooks.constructEvent(event.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch(e){
    return { statusCode: 400, body: `Webhook signature failed: ${e.message}` };
  }

  // MVP: apenas confirma recebimento
  if (evt.type === "checkout.session.completed") {
    // aqui você geraria token + enviaria email + liberaria entrega
  }

  return { statusCode: 200, body: "ok" };
};
