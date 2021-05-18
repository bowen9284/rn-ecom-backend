import Router from 'express';
import Product from '../models/product.js';

const productsRouter = Router();

productsRouter.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    return res.status(500).json({ success: false });
  }

  return res.send(productList);
});

productsRouter.post(`/`, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  const savedProduct = await product.save();

  if (!savedProduct) {
    return res.status(500).json({
      success: false,
    });
  }

  return res.status(201).json(savedProduct);
});

export default productsRouter;
