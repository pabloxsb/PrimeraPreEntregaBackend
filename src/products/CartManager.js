import fs from "fs";
import { getProductById } from '../products/ProductManager.js'


export default class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async readCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, "utf-8");
                if (carts) {
                    const cartsJs = JSON.parse(carts);
                    this.carts = cartsJs;
                } else {
                    this.carts = [];
                }
                return this.carts;
            } else {
                this.carts = [];
                return this.carts;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getCarts() {
        if (this.carts.length === 0) {
            return "List empty";
        }
        return this.carts;
    }

    async writeCarts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        } catch (error) {
            console.log(error);
        }
    }

    async addCart() {
        await this.readCarts();
        const newCart = {
            idCart: this.getId() + 1,
            products: [],
        };
        this.carts.push(newCart);
        await this.writeCarts();
        return newCart;
    }

    getId() {
        let maxId = 0;
        this.carts.map((cart) => {
            if (cart.idCart > maxId) {
                maxId = cart.idCart;
            }
            return maxId;
        });
        return maxId;
    }

    async getCartById(idCart) {
        await this.readCarts();
        const cart = this.carts.find((cart) => cart.idCart === idCart);
        if (!cart) {
            return "Not found";
        }
        return cart;
    }

    async saveProductToCart(cid, pid) {
        await this.readCarts();
        const cartIndex = this.carts.findIndex((cart) => cart.idCart === cid);
        if (cartIndex === -1) {
            return "Cart not found";
        }

        const prodExists = await getProductById(pid);
        if (prodExists === null) {
            return "Product not found";
        }

        const cart = this.carts[cartIndex];
        const prodIndex = cart.products.findIndex((prod) => prod.id === pid);

        if (prodIndex !== -1) {
            cart.products[prodIndex].quantity += 1;
        } else {
            const newProduct = {
                id: pid,
                quantity: 1,
            };
            cart.products.push(newProduct);
        }

        await this.writeCarts();
        return cart;
    }
}