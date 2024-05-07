import fs from "fs";
const pathFile = "./products.json"

let arrayProd = []

export const readProducts = async () => {
  try {
    if (fs.existsSync(pathFile)) {
      const products = await fs.promises.readFile(pathFile, "utf-8");
      if (products) {
        const productsJs = JSON.parse(products);
        arrayProd = productsJs;
      } else {
        arrayProd = [];
      }
      return arrayProd;
    } else {
      arrayProd = [];
      return arrayProd;
    }
  } catch (error) {
    console.log(error);
  }
}

export const getProducts = async () => {
  if (arrayProd.length === 0) {
    return "List empty";
  }
  return arrayProd;
}

export const writeProducts = async (newProduct) => {
  try {
    arrayProd.push(newProduct);
    await fs.promises.writeFile(pathFile, JSON.stringify(arrayProd));
    return newProduct;
  } catch (error) {
    console.log(error);
  }
}

export const addProduct = async (product) => {
  getProducts();
  const { title, description, price, thumbnails, code, stock, category } = product;

  if (!title || !description || !price || !code || !stock || !category) {
    return "Error: All fields are required";
  }

  const existingProduct = arrayProd.find((product) => product.code === code);
  if (existingProduct) {
    return "Error: The product has already been added";
  }

  const newProduct = {
    id: getId() + 1,
    title,
    description,
    price,
    thumbnails: thumbnails || [],
    code,
    stock,
    category,
    status: true
  };

  await writeProducts(newProduct);
}

const getId = () => {
  let maxId = 0;
  arrayProd.map((prod) => {
    if (prod.id > maxId) {
      maxId = prod.id;
    }
    return maxId;
  });
  return maxId;
}

export const getProductById = async (id) => {
  readProducts();
  const product = arrayProd.find((product) => product.id === id);
  if (!product) {
    return null;
  }
  return product;
}


export const updateProduct = async (id, updatedFields) => {
  const productIndex = arrayProd.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return "Product not found";
  }

  const { id: updatedId, ...fieldsToUpdate } = updatedFields;

  const updatedProduct = { ...arrayProd[productIndex], ...fieldsToUpdate };
  arrayProd[productIndex] = updatedProduct;

  await fs.promises.writeFile(pathFile, JSON.stringify(arrayProd));
  return updatedProduct;
}

export const deleteProduct = async (id) => {
  const index = arrayProd.findIndex((product) => product.id === id);
  if (index === -1) {
    return "Product not found";
  }
  const deletedProduct = arrayProd.splice(index, 1);
  await fs.promises.writeFile(pathFile, JSON.stringify(arrayProd));
  return deletedProduct[0];
}