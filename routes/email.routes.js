import express from 'express';
import {
  marketingCampaign,
  paymentRequest,
  sendWelcomeEmail,
} from '../controllers/email.controller.js';

const router = express.Router();

router.post('/payment/request', paymentRequest);
router.post('/campaign/customer', marketingCampaign);

// email test
router.post('/welcome-email', sendWelcomeEmail);
router.post('/payment-request-email', sendWelcomeEmail);
router.post('/order-place-email', sendWelcomeEmail);
router.post('/otp-email', sendWelcomeEmail);
router.post('/update-order-email', sendWelcomeEmail);
router.post('/order-place-email', sendWelcomeEmail);

export const emailRoutes = router;
