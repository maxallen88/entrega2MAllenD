import ProductManager from "./ProductManager.js";

(async () => {
  const pm = new ProductManager("./files/products.json");

  let data = {
    title: "BTC/USDC",
    description: "Binance",
    price: 25000,
    thumbnail: "Images not available",
    code: "003",
    stock: "0.1",
  };

  const coin = await pm.createProduct(data); 
  console.log("added  Coin", JSON.stringify(await pm.getProducts()));

  await pm.updateProduct({ ...coin, price: 48000 });
  console.log("updated Coin", JSON.stringify(await pm.getProducts()));


  // lo dejo comillado para que cuente el ID. SACANDO BORRA LA INFO

 // await pm.removeProduct(coin.id);
 // console.log("removed Coin", JSON.stringify(await pm.getProducts()));
})();
