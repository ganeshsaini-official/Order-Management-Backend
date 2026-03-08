import { Customer } from "../models/index.js"; 

const createCustomer = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const customer = await Customer.create({ name, email, phone });
        res.status(201).json(customer);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createCustomer, getCustomers };