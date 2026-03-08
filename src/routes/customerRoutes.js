import express from 'express';
import { createCustomer, getCustomers } from '../controllers/customerController.js';

const customerRoutes = express.Router();

customerRoutes.post('/', createCustomer);
customerRoutes.get('/', getCustomers);

export default customerRoutes;