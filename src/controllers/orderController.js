import { sequelize } from '../config/database.js';
import { Customer, Product, Order, OrderItem } from "../models/index.js"; 

const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { customerId, items } = req.body;
        
        if (!customerId || !items || !items.length) {
            await transaction.rollback();
            return res.status(400).json({ error: 'CustomerId and items are required' });
        }
        
        const customer = await Customer.findByPk(customerId, { transaction });
        if (!customer) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ error: `Product with id ${item.productId} not found` });
            }
            
            if (product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ 
                    error: `Insufficient stock for product ${product.name}. Available: ${product.stock}` 
                });
            }
            
            const itemPrice = parseFloat(product.price) * item.quantity;
            totalAmount += itemPrice;
            
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            });
            
            await product.update({
                stock: product.stock - item.quantity
            }, { transaction });
        }
        
        const order = await Order.create({
            customerId,
            totalAmount,
            status: 'placed'
        }, { transaction });
        
        for (const item of orderItems) {
            await OrderItem.create({
                ...item,
                orderId: order.id
            }, { transaction });
        }
        
        await transaction.commit();
        
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: OrderItem,
                    include: [{
                        model: Product,
                        attributes: ['id', 'name', 'price']
                    }]
                }
            ]
        });
        
        res.status(201).json(completeOrder);
        
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findByPk(id, {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: OrderItem,
                    include: [{
                        model: Product,
                        attributes: ['id', 'name', 'price']
                    }]
                }
            ]
        });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { id } = req.params;
        
        const order = await Order.findByPk(id, {
            include: [{
                model: OrderItem,
                include: [Product]
            }],
            transaction
        });
        
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Order not found' });
        }
        
        if (order.status === 'cancelled') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Order already cancelled' });
        }
        
        for (const item of order.OrderItems) {
            await item.Product.update({
                stock: item.Product.stock + item.quantity
            }, { transaction });
        }
        
        await order.update({ status: 'cancelled' }, { transaction });
        
        await transaction.commit();
        
        res.json({ 
            message: 'Order cancelled successfully',
            orderId: order.id,
            status: 'cancelled'
        });
        
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

export { createOrder, getOrder, cancelOrder };