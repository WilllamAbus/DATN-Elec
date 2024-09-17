const crypto = require('crypto');
const {calculateSignature} = require('./calculateSignature')
const dotenv = require('dotenv');

dotenv.config();
// const URL_FE_PAY = process.env.URL_FE_PAY;

// MoMo API credentials
const partnerCode = "MoMo";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; 
const accessKey = "F8BBA842ECF85"; // Only use on the client if CORS is configured properly
const redirectUrl = 'http://localhost:3150/confimAuc';
const ipnUrl = 'http://localhost:3150/confimAuc';

// const calculateSignature = (rawSignature, secretKey) => {
  
//   return crypto.createHmac('sha256', secretKey)
//                .update(rawSignature)
//                .digest('hex');
// };

const momoService = {
  execPostRequest: async (url, data) => {
    try {
      console.log('Sending request to:', url);
      console.log('Request body:', data);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cors-api-key': 'temp_1f7c5cc4e0bf72ae8aae7281de4c2e3e',
          // 'origin': 'http://localhost:3150',
          'x-requested-with': 'XMLHttpRequest'
        },
        body: JSON.stringify(data),
      });

      const rawResponse = await response.text();
      console.log('Raw Response:', rawResponse);

      let responseBody;
      try {
        responseBody = JSON.parse(rawResponse);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        responseBody = rawResponse;
      }

      if (response.ok) {
        console.log('Response:', responseBody);
        return responseBody;
      } else {
        console.error(`HTTP error! Status: ${response.status}, Message: ${responseBody.message || responseBody}`);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseBody.message || responseBody}`);
      }
    } catch (error) {
      console.error('Error in execPostRequest:', error.message || error);
      throw error;
    }
  },
  
  createPaymentLink: async (amount, orderId, orderInfo) => {
    const requestId = partnerCode + new Date().getTime();
    const requestType = 'payWithMethod';
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = calculateSignature(rawSignature, secretKey);
console.log('signature', signature);

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId: orderId.toString(),
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      autoCapture,
      lang,
      signature,
    };

    console.log('Prepared request body for MoMo:', requestBody);

    const proxyUrl = 'https://proxy.cors.sh/https://test-payment.momo.vn/v2/gateway/api/create';
    return momoService.execPostRequest(proxyUrl, requestBody);
  },
  
  processMoMoPaymentWithRetry: async (amount, orderId, orderInfo) => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const result = await momoService.createPaymentLink(amount, orderId, orderInfo);

        if (result && result.payUrl) {
          console.log('Redirecting to MoMo payment page...');
          return result.payUrl;
        } else {
          console.error('Invalid payment result:', result);
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const delay = Math.pow(2, retries) * 1000;
          console.log(`Retrying in ${delay} milliseconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
        } else {
          console.error('Error during payment:', error.message);
          throw error;
        }
      }
    }

    console.error('Exceeded maximum retries. Payment failed.');
  }
};

module.exports = momoService;
