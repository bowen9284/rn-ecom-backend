import Router from 'express';
import Category from '../models/category.js';

const categoriesRouter = Router();

categoriesRouter.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(categoryList);
});

categoriesRouter.get(`/:id`, async (req, res) => {
  let category;

  try {
    category = await Category.findById(req.params.id);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: 'The category was not found.' });
  }

  return res.status(200).send(category);
});

categoriesRouter.post(`/`, async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  const savedCategory = await category.save();

  if (!savedCategory) {
    return res.status(404).send('The category cannot be created.');
  }

  return res.status(201).send(category);
});

categoriesRouter.put('/:id', async (req, res) => {
  let category;

  try {
    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!category) {
    res
      .status(404)
      .json({ success: false, message: 'The category was not found.' });
  }

  res.send(category);
});

categoriesRouter.delete(`/:id`, async (req, res) => {
  let removedCategory;

  try {
    removedCategory = await Category.findByIdAndRemove(req.params.id);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!removedCategory) {
    res
      .status(404)
      .json({ success: false, message: 'The category was not found.' });
  }

  res.status(200).json({ success: true, message: 'The category was deleted.' });
});

export default categoriesRouter;
