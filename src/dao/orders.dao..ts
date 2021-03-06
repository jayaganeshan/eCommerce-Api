import { Transaction } from "sequelize/types";
import { db } from "../services/db";
import { IOrderAttributes, Order } from "../models/Orders";
import { OrderItems } from "../models/Order_items";
import { Product } from "../models/Products";
import { User } from "../models/User";
import { Payment } from "../models/Payment";

//@types
export interface IOrderItems {
  product_id: number;
  quantity: string;
}
//place order with user_id and Product object of IOrderItems
export const placeOrder = async (order: IOrderAttributes, transaction: Transaction) => {
  const result = await Order.create({ user_id: order.user_id, date: order.date }, { transaction });
  return result;
};

export const getAllOrders = async () => {
  const order_items = await User.findAll({ attributes: ["name", "user_id"], include: { model: Order } });
  return order_items;
};

export const cancelOrder = async (order_id: string) => {
  const t = await db.transaction();
  const orderItems = await OrderItems.findAll({ where: { order_id } });
  if (orderItems.length == 0) return { statusCode: 404, message: "No Orders" };
  else {
    orderItems.forEach(async (order: any) => {
      await Product.increment({ number_in_stock: order.quantity }, { where: { product_id: order.product_id }, transaction: t });
      await order.destroy({ transaction: t });
    });
    const order = await Order.findOne({ where: { order_id } });
    if (!order) {
      return { statusCode: 404, message: "No such Order" };
    } else {
      await order?.destroy({ transaction: t });
      await t.commit();
      return { statusCode: 200, message: "Order Cancelled Successfully" };
    }
  }
};
export const getOrderById = async (order_id: number) => {
  const result = await Order.findOne({ where: { order_id } });
  return result;
};
export const getProductsInOrderItems = async (order_id: number, user_id: number) => {
  const result = Order.findOne({ where: { order_id, user_id }, include: { model: Product } });
  return result;
};

export const getProductsInOrder = async (user_id: number) => {
  const result = Order.findAll({ where: { user_id }, include: [{ model: Product }, { model: Payment }] });
  return result;
};
export const getOrderByUserIdOrderId = async (user_id: number, order_id: number) => {
  const result = Order.findOne({
    where: {
      order_id,
      user_id,
    },
    include: Product,
  });
  return result;
};

export const getPaymentInfo = async (order_id: number) => {
  const result = Payment.findOne({ where: { order_id } });
  return result;
};
