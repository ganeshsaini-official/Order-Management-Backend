import { Product } from "../models/index.js";  

const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        
        if (!name || !price || stock === undefined) {
            return res.status(400).json({ error: 'Name, price and stock are required' });
        }
        
        if (price < 0 || stock < 0) {
            return res.status(400).json({ error: 'Price and stock must be positive numbers' });
        }
        
        const product = await Product.create({ name, price, stock });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createProduct, getProducts };