import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  _writeProductsToFile = async (products) => {
    await fs.writeFile(this.path, JSON.stringify(products, null, "\t"), "utf-8");
  };

  getProducts = async () => {
    try {
      if (await fs.access(this.path)) {
        const data = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error reading file: ${this.path} - ${error.message}`);
      return [];
    }
  };

  createProduct = async (product) => {
    const currentProducts = await this.getProducts();

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.error("Data missing. All data is required");
      return;
    }

    if (currentProducts.some((p) => p.code === product.code)) {
      console.log(`A product with the code: ${product.code} already exists`);
      return;
    }

    let productId = 1;

    if (currentProducts.length !== 0) {
      productId = currentProducts[currentProducts.length - 1].id + 1;
    }
    const newProduct = { ...product, id: productId };

    currentProducts.push(newProduct);

    try {
      await this._writeProductsToFile(currentProducts);
    } catch (error) {
      console.error(`Error writing file: ${this.path} - ${error.message}`);
    }

    return newProduct;
  };

  getProductById = async (id) => {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  };

  updateProduct = async (updateProduct) => {
    const updateArray = await this.getProducts();
    const indexOfProductToUpdate = updateArray.findIndex((p) => p.id === updateProduct.id);

    if (indexOfProductToUpdate < 0) {
      console.error(`Can't find the product you are trying to update: id: ${updateProduct.id}`);
      return;
    }

    updateArray[indexOfProductToUpdate] = updateProduct;

    try {
      await this._writeProductsToFile(updateArray);
    } catch (error) {
      console.error(`Error writing file: ${this.path} - ${error.message}`);
    }

    return updateProduct;
  };

  removeProduct = async (id) => {
    const arrayToUpdate = await this.getProducts();
    const indexOfProductToDelete = arrayToUpdate.findIndex((p) => p.id === id);

    if (indexOfProductToDelete < 0) {
      console.error(`Can't find the product you are trying to delete: id: ${id}`);
      return;
    }

    arrayToUpdate.splice(indexOfProductToDelete, 1);

    try {
      await this._writeProductsToFile(arrayToUpdate);
    } catch (error) {
      console.error(`Error writing file: ${this.path} - ${error.message}`);
    }

    return arrayToUpdate;
  };
}
