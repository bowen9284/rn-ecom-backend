import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Category = model('Category', categorySchema);

export default Category;
