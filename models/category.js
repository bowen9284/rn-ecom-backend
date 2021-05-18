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

categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

categorySchema.set('toJSON', {
  virtuals: true,
});

const Category = model('Category', categorySchema);

export default Category;
