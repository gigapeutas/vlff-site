const fs = require("fs");
const path = require("path");

function getProducts(){
  const p = path.join(process.cwd(), "content", "products", "products.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}
function findBySlug(slug){
  return getProducts().find(x => x.slug === slug);
}

module.exports = { getProducts, findBySlug };
