import express from 'express';
import dotenv from 'dotenv';

import { connectDB, sequelize } from './src/config/database.js';
import Customer from './src/models/Customer.js';
import Product from './src/models/Product.js';
import Order from './src/models/Order.js';
import OrderItem from './src/models/OrderItem.js';
import customerRoutes from './src/routes/customerRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Order Management System API' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});