# VLFF Site (Netlify + Stripe + Admin)

## Estrutura
- public/ (site estático)
- netlify/functions/ (functions)
- content/products/ (produtos)

## Deploy no Netlify
- Publish directory: public
- Functions directory: netlify/functions

## Variáveis de ambiente no Netlify
- STRIPE_SECRET_KEY
- SITE_URL (ex: https://SEU_SITE.netlify.app)
- STRIPE_WEBHOOK_SECRET (após criar webhook no Stripe)

## Webhook Stripe
Endpoint:
https://SEU_SITE.netlify.app/.netlify/functions/stripe-webhook
Evento:
checkout.session.completed

## Admin
/ admin
Config em public/admin/config.yml
