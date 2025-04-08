import express from 'express';
import {
  createCustomOrder,
  createOrder,
  createViagraOrder,
  deleteViagraOrder,
  getAllOrders,
  getAllViagraOrders,
  getOrderByCustomer,
  getOrderById,
  getViagraOrderByCustomer,
  getViagraOrderById,
  orderUpdate,
  updateViagraOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

router.get('/all', getAllOrders);

router.get('/:id', getOrderById);
router.get('/customer/:id', getOrderByCustomer);

router.post('/create', createOrder);
router.post('/create-custom', createCustomOrder);

router.put('/:id', orderUpdate);

// viagra
router.post('/create/viagra', createViagraOrder);

router.get('/viagra/all', getAllViagraOrders);

router.get('/viagra/:id', getViagraOrderById);

router.get('/viagra/customer/:id', getViagraOrderByCustomer);

router.put('/viagra/:id', updateViagraOrder);

router.delete('/viagra/:id', deleteViagraOrder);

export const orderRoutes = router;
