import { Router } from "express";
import { readProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../products/ProductManager.js'

const productsRouter = Router()

//<--- rutas --->

productsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await readProducts();
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).json(limitedProducts);
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const prod = await getProductById(parseInt(pid));
    if (prod) {
      res.json(prod);
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


productsRouter.post('/', async (req, res) => {
  try {
    const product = req.body;
    const prodAdded = await addProduct(product);
    res.json(prodAdded);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


productsRouter.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;
    const prod = await getProductById(parseInt(pid));
    if (prod) {
      await updateProduct(parseInt(pid), updatedFields);
      res.json({ message: `Product id: ${pid} updated successfully` });
    } else {
      res.status(400).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


productsRouter.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const prod = await getProductById(parseInt(pid));
    if (prod) {
      const deletProd = await deleteProduct(parseInt(pid));
      res.json(deletProd);
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
})

export default productsRouter