// Ensure the path is correct

export class SanboxPayment {
  constructor(private signatureService: { calculateSignature : (data: string, secretKey: string) => Promise<string> }) {}

  async processMoMoPayment(): Promise<any> {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = "pay with MoMo";
    const redirectUrl = "http://localhost:3150/complete";
    const ipnUrl = "http://localhost:3150/complete";
    const amount = "50000";
    const requestType = "captureWallet";
    const extraData = "";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = await this.signatureService.calculateSignature(rawSignature, secretKey);

    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: 'en'
    });

    return this.execPostRequest('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
  }

  async execPostRequest(url: string, data: string): Promise<any> {
    const proxyUrl = 'https://proxy.cors.sh/' + url;

    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length.toString(),
          'x-cors-api-key': 'temp_1f7c5cc4e0bf72ae8aae7281de4c2e3e',
        },
        body: data,
      });

      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in execPostRequest:', error);
      throw error;
    }
  }

  async processMoMoPaymentWithRetry(): Promise<void> {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const result = await this.processMoMoPayment();

        if (result && result.payUrl) {
       
          window.location.href = result.payUrl;
          return;
        } else {
          console.error('Invalid payment result:', result);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if ((error as any).status === 429) {
            const delay = Math.pow(2, retries) * 1000;
            console.log(`Retrying in ${delay} milliseconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            retries++;
          } else {
            console.error('Error during payment:', error.message);
            throw error;
          }
        } else {
          console.error('Unknown error during payment');
          throw error;
        }
      }
    }

    console.error('Exceeded maximum retries. Payment failed.');
  }
}