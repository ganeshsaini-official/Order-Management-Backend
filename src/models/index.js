import Customer from './Customer.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

Customer.hasMany(Order, {
    foreignKey: 'customerId',
});

Order.belongsTo(Customer, {
    foreignKey: 'customerId',
});

Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
});

OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
});

Product.hasMany(OrderItem, {
    foreignKey: 'productId',
});

OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
});

export { Customer, Product, Order, OrderItem };