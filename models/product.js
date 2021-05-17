import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const productSchema = Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

const Product = model('Product', productSchema);

export default Product;
