import { Router } from "express";
import CartManager from "../products/CartManager.js"

const cartsRouter = Router()
const cartManager = new CartManager("./carts.json");

//<--- rutas --->

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid));
        if (cart === "Not found") {
            res.status(404).json({ message: "Cart not found" });
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.saveProductToCart(parseInt(cid), parseInt(pid));
        if (cart === "Cart not found") {
            res.status(404).json({ message: "Cart not found" });
        } else if (cart === "Product not found") {
            res.status(404).json({ message: "Product not found" });
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default cartsRouter;