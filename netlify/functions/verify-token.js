const { getProducts } = require("./_utils");

exports.handler = async (event) => {
  const token = (event.queryStringParameters && event.queryStringParameters.token) || "";

  // Catálogo público (para a loja renderizar sem build)
  if (token === "__catalog__") {
    return { statusCode: 200, body: JSON.stringify({ products: getProducts() }) };
  }

  // TODO: validar token de entrega real
  return { statusCode: 400, body: JSON.stringify({ error: "Token inválido (MVP). Use __catalog__ para catálogo." }) };
};
