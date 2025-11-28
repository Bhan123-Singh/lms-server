// import {Router} from 'express';
// import {getRazorpayApiKey,buySubcription,verifySubcription,cancelSubcription,allPayments} from '../controllers/payment.controller.js';
// import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';
// const router=Router();
// router
// .route('/razorpay-key')
// .get(getRazorpayApiKey);

// router
// .route('/subscribe')
// .post(isLoggedIn,
//     buySubcription
// )

// router
// .route('/verify')
// .post(isLoggedIn,
//     verifySubcription
// )

// router
// .route('/unsubscribe')
// .post(isLoggedIn,
//     cancelSubcription
// )

// router
// .route('/')
// .get(isLoggedIn,
//     authorizedRoles('ADMIN'),
//     allPayments
// );

// export default router;