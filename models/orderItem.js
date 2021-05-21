import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const OrderItem = model('OrderItem', orderItemSchema);

export default OrderItem;
