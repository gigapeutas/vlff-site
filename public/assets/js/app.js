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
        <article class="card product-card">
          <div class="pill">${p.game}</div>
          <h3 class="h2" style="margin:10px 0 6px">${p.title}</h3>
          <p class="sub">${p.short}</p>
          <div class="product-meta">
            <div class="price">${money(p.price_brl)}</div>
            <button class="cta btn-block-mobile" data-buy="${p.slug}">Comprar</button>
          </div>
        </article>
      `));
    }

    mount.querySelectorAll("[data-buy]").forEach((b)=>{
      b.addEventListener("click", ()=> startCheckout(b));
    });
  }

  tabs.forEach((t)=>{
    t.addEventListener("click", ()=>{
      active = t.getAttribute("data-tab");
      tabs.forEach((x)=>x.setAttribute("aria-pressed", "false"));
      t.setAttribute("aria-pressed", "true");
      paint();
    });
  });

  paint();
}

async function startCheckout(button){
  if(!button) return;

  const slug = button.getAttribute("data-buy");
  const oldLabel = button.textContent;
  button.disabled = true;
  button.classList.add("loading");
  button.textContent = "Abrindo checkout...";

  try {
    const r = await fetch(API("create-checkout-session"),{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ slug })
    });
    const j = await r.json();

    if(!r.ok){
      throw new Error(j.error || "Falha no checkout.");
    }

    window.location.href = j.url;
  } catch (err) {
    alert(err.message || "Falha no checkout.");
    button.disabled = false;
    button.classList.remove("loading");
    button.textContent = oldLabel;
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderLoja();
});
