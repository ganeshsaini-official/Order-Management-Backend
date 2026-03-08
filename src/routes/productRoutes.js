import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';

const productRoutes = express.Router();

productRoutes.post('/', createProduct);
productRoutes.get('/', getProducts);

export default productRoutes;