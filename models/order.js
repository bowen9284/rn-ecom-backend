import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const orderSchema = Schema({});

const Order = model('Order', orderSchema);

export default Order;
