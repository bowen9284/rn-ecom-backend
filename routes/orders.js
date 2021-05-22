import Router from 'express';
import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';

const ordersRouter = Router();

ordersRouter.get(`/`, async (req, res) => {
  const ordersList = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });

  if (!ordersList) {
    res.status(500).json({ success: false });
  }

  res.send(ordersList);
});

ordersRouter.get(`/:id`, async (req, res) => {
  let order;

  try {
    order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!order) {
    return res
      .status(404)
      .json({ success: false, message: 'The order was not found.' });
  }

  return res.status(200).send(order);
});

ordersRouter.post(`/`, async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemIdsResolved = await orderItemIds;
  const totalPrices = await Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price'
      );

      const total = orderItem.product.price * orderItem.quantity;
      return total;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) {
    return res.status(400).send('The order cannot be created.');
  }

  return res.send(order);
});

ordersRouter.put('/:id', async (req, res) => {
  let order;

  try {
    order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!order) {
    res
      .status(404)
      .json({ success: false, message: 'The order was not found.' });
  }

  res.send(order);
});

ordersRouter.delete(`/:id`, async (req, res) => {
  let removedOrder;

  try {
    removedOrder = await Order.findByIdAndRemove(req.params.id);

    if (removedOrder) {
      // revist this "cascade delete" and reserach "pre" middleware hooks
      await removedOrder.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndRemove(orderItem);
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'The order was not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  res.status(200).json({ success: true, message: 'The order was deleted.' });
});

ordersRouter.get('/get/total-sales', async (req, res) => {
  let totalSales;
  try {
    totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!totalSales) {
    return res.status(400).send('Total sales cannot be calculated');
  }

  return res.send({ totalSales: totalSales.pop().totalSales });
});

ordersRouter.get(`/get/count`, async (req, res) => {
  let orderCount;

  try {
    orderCount = await Order.countDocuments((count) => count);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  return res.status(200).send({
    count: orderCount,
  });
});

ordersRouter.get(`/get/user-orders/:userId`, async (req, res) => {
  const userOrdersList = await Order.find({ user: req.params.userId })
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrdersList) {
    res.status(500).json({ success: false });
  }

  res.send(userOrdersList);
});

export default ordersRouter;
