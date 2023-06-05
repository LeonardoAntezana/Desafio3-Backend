import express from 'express';
import { ProductManager } from "./ProductManager.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

const manager1 = new ProductManager('Leonardo', './products.json');

app.get('/products', async (req, res) => {
  const products = await manager1.getProducts();
  const { limit } = req.query;
  if (!limit) {
    return res.send({ products: products });
  }
  else {
    if (limit < products.length) {
      const filter = products.slice(0, limit);
      res.send({ products: filter })
    }
    res.send({ error: 'fuera de rango' })
  }
})

app.get('/products/:pid', async (req, res) => {
  const products = await manager1.getProducts();
  const id = req.params.pid;
  const productFind = products.find(prod => prod.id == id);
  if (productFind) {
    return res.send({ productFind: productFind });
  }
  res.send({ error: 'Producto no encontrado' })
})

app.listen(8080, console.log('Escuchando puerto 8080'))