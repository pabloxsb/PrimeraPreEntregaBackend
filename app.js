import express from "express";
import productsRouter from './src/routes/products.js'
import cartsRouter from './src/routes/carts.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => {
  console.log("Server ok on port 8080");
});