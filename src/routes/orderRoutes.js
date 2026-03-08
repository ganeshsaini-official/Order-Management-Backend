import express from 'express';
import { createOrder, getOrder, cancelOrder } from '../controllers/orderController.js';

const orderRoutes = express.Router();

orderRoutes.post('/', createOrder);
orderRoutes.get('/:id', getOrder);
orderRoutes.post('/:id/cancel', cancelOrder);

export default orderRoutes;