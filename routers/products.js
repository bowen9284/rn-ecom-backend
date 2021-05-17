import Router from 'express';
import Product from '../models/product.js';

const router = Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

router.post(`/`, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  const savedProduct = await product.save();

  if (!savedProduct) {
    res.status(500).json({
      success: false,
    });
  }

  res.status(201).json(savedProduct);
});

export default router;
