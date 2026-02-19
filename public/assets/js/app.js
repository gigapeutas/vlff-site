const API = (p)=>`/.netlify/functions/${p}`;
const money = (cents)=> (cents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

async function getProducts(){
  const r = await fetch(API("verify-token?token=__catalog__"));
  const j = await r.json();
  return j.products || [];
}

function el(html){
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstChild;
}

async function renderLoja(){
  const mount = document.getElementById("products");
  if(!mount) return;

  const products = await getProducts();
  const tabs = document.querySelectorAll("[data-tab]");
  let active = "Free Fire";

  function paint(){
    mount.innerHTML = "";
    const list = products.filter(p=>p.game===active);
    for(const p of list){
      mount.appendChild(el(`
        <div class="card">
          <div class="pill">${p.game}</div>
          <h3 style="margin:10px 0 6px">${p.title}</h3>
          <div class="sub">${p.short}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap">
            <div class="price">${money(p.price_brl)}</div>
            <button class="cta" data-buy="${p.slug}">Comprar</button>
          </div>
        </div>
      `));
    }
    mount.querySelectorAll("[data-buy]").forEach(b=>{
      b.addEventListener("click", ()=> startCheckout(b.getAttribute("data-buy")));
    });
  }

  tabs.forEach(t=>{
    t.addEventListener("click", ()=>{
      active = t.getAttribute("data-tab");
      tabs.forEach(x=>x.classList.remove("btn"));
      tabs.forEach(x=>x.classList.add("btn"));
      paint();
    });
  });

  paint();
}

async function startCheckout(slug){
  // cria sessão e redireciona pro Stripe Checkout
  const r = await fetch(API("create-checkout-session"),{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ slug })
  });
  const j = await r.json();
  if(!r.ok){
    alert(j.error || "Falha no checkout.");
    return;
  }
  window.location.href = j.url;
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderLoja();
});
