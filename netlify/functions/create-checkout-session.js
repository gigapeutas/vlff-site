const Stripe = require("stripe");
const { findBySlug } = require("./_utils");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Use POST" }) };
  }

  const { STRIPE_SECRET_KEY, SITE_URL } = process.env;
  if (!STRIPE_SECRET_KEY || !SITE_URL) {
    return { statusCode: 500, body: JSON.stringify({ error: "Env vars ausentes (STRIPE_SECRET_KEY, SITE_URL)" }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}
  const slug = body.slug;
  if (!slug) return { statusCode: 400, body: JSON.stringify({ error: "slug obrigatório" }) };

  const product = findBySlug(slug);
  if (!product) return { statusCode: 404, body: JSON.stringify({ error: "Produto não encontrado" }) };

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try{
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "brl",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: product.price_brl,
          product_data: { name: product.title, description: product.short }
        }
      }],
      metadata: { slug: product.slug, game: product.game },
      success_url: `${SITE_URL}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/loja.html`
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e){
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
