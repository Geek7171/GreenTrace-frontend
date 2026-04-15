import RazorpayCheckout from 'react-native-razorpay';
import { colors } from '../constants/theme';

// ENTER YOUR RAZORPAY TEST KEY HERE
export const RAZORPAY_KEY_ID = 'rzp_test_SdmB5DTy6PIVOz'; 

/**
 * Opens the Razorpay payment sheet for the specified amount
 * @param {number} amount - Amount in Rupees (e.g. 100)
 * @param {string} userEmail - User's email for prefill
 * @param {string} userName - User's name for prefill
 * @returns {Promise} - Resolves with payment ID on success
 */
export const processFinePayment = (amount, userEmail, userName) => {
  return new Promise((resolve, reject) => {
    const options = {
      description: 'Account Reinstatement Fine',
      image: 'https://raw.githubusercontent.com/Geek7171/GreenTrace-frontend/main/assets/icon.png',
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Razorpay expects amount in paise (10000 = ₹100)
      name: 'GreenTrace Green Penalty',
      prefill: {
        email: userEmail || '',
        contact: '',
        name: userName || ''
      },
      theme: { color: colors.primary || '#2E7D32' }
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // data.razorpay_payment_id is the unique payment identifier
        resolve(data);
      })
      .catch((error) => {
        // error contains 'code' and 'description'
        reject(error);
      });
  });
};
