import Router from 'express';
import Category from '../models/category.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';

const productsRouter = Router();
const { isValidObjectId } = mongoose;

productsRouter.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }
  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

productsRouter.get(`/:id`, async (req, res) => {
  let product;

  try {
    product = await Product.findById(req.params.id).populate('category');
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'The product was not found.' });
  }

  return res.status(200).send(product);
});

productsRouter.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(400).send('Invalid Category');
  }

  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    countInStock: req.body.countInStock,
  });

  const savedProduct = await product.save();

  if (!savedProduct) {
    res.status(500).send('The product cannot be saved');
  }

  res.send(savedProduct);
});

productsRouter.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID');
  }

  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send('Invalid Category');
  }

  let product;

  try {
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock,
      },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!product) {
    res
      .status(404)
      .json({ success: false, message: 'The product was not found.' });
  }

  res.status(200).json(product);
});

productsRouter.delete(`/:id`, async (req, res) => {
  let removedProduct;

  try {
    removedProduct = await Product.findByIdAndRemove(req.params.id);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!removedProduct) {
    res
      .status(404)
      .json({ success: false, message: 'The product was not found.' });
  }

  res.status(200).json({ success: true, message: 'The product was deleted.' });
});

productsRouter.get(`/get/count`, async (req, res) => {
  let productCount;

  try {
    productCount = await Product.countDocuments((count) => count);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  return res.status(200).send({
    count: productCount,
  });
});

productsRouter.get(`/get/featured/:count`, async (req, res) => {
  let featuredProducts;
  const count = req.params.count || 0;

  try {
    featuredProducts = await Product.find({
      isFeatured: true,
    }).limit(+count);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  return res.send(featuredProducts);
});

export default productsRouter;
