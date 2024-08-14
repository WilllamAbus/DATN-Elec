export class SanboxPayment {
  constructor(private signatureService: { calculateSignature: (data: string, secretKey: string) => Promise<string> }) {}

  // Kiểm tra thời gian hệ thống trước khi thực hiện giao dịch
  private checkSystemTime(): void {
    const serverTime = new Date().getTime();
    const currentTime = Date.now();

    if (Math.abs(serverTime - currentTime) > 1000) {
      console.warn("System time might be out of sync with real time.");
    }
  }

  // Tạo requestId và orderId duy nhất
  private generateUniqueId(): string {
    return "MOMO" + new Date().getTime() + Math.floor(Math.random() * 10000);
  }

  async processMoMoPayment(): Promise<any> {
    this.checkSystemTime(); // Kiểm tra thời gian hệ thống

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85"; // Chỉ sử dụng trên client nếu bạn đã cấu hình CORS đúng cách
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; // Chỉ sử dụng trên server để bảo mật hơn
    const requestId = this.generateUniqueId();
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

    // Lưu ý: Thực hiện yêu cầu từ client
    const proxyUrl = 'https://proxy.cors.sh/' + 'https://test-payment.momo.vn/v2/gateway/api/create';
    return this.execPostRequest(proxyUrl, requestBody);
  }

  async execPostRequest(url: string, data: string): Promise<any> {
    try {
      console.log('Sending request to:', url);
      console.log('Request body:', data);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length.toString(),
          'x-cors-api-key': 'temp_1f7c5cc4e0bf72ae8aae7281de4c2e3e',
        },
        body: data,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Response:', jsonResponse);
        return jsonResponse;
      } else {
        const responseBody = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Message: ${responseBody}`);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseBody}`);
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

        // Log dữ liệu trả về từ MoMo
        console.log('MoMo payment result:', result);

        if (result && result.payUrl) {
          // Lưu thời gian khi QR code được tạo ra
          const creationTime = new Date().getTime();
          const expirationTime = creationTime + 10 * 60 * 1000; // QR code hiệu lực trong 10 phút
          localStorage.setItem('paymentCreationTime', creationTime.toString());
          localStorage.setItem('paymentExpirationTime', expirationTime.toString());

          // Hiển thị thông báo về thời gian hiệu lực của QR code
          alert("Please complete the payment within 10 minutes.");

          console.log("Redirecting to MoMo payment page...");
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

  // Hiển thị thời gian hiệu lực của QR code cho người dùng
  static displayTimeLeft() {
    const expirationTime = parseInt(localStorage.getItem('paymentExpirationTime') || '0', 10);
    const currentTime = new Date().getTime();

    if (expirationTime > currentTime) {
      const timeLeft = expirationTime - currentTime;
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      console.log(`Time left to complete payment: ${minutes} minutes and ${seconds} seconds`);
    } else {
      console.log('The QR code has expired.');
    }
  }

  // Xử lý quét mã QR và kiểm tra trạng thái giao dịch
  async handleQRCodeScan(transactionId: string): Promise<void> {
    // Kiểm tra thời gian hết hạn trước
    if (this.isPaymentExpired()) {
      alert('The transaction has expired. Please initiate a new payment.');
      return;
    }

    // Nếu giao dịch chưa hết hạn, kiểm tra trạng thái từ API
    await this.checkTransactionStatus(transactionId);
  }

  private isPaymentExpired(): boolean {
    const expirationTime = parseInt(localStorage.getItem('paymentExpirationTime') || '0', 10);
    const currentTime = new Date().getTime();

    return expirationTime <= currentTime;
  }

  private async checkTransactionStatus(transactionId: string): Promise<void> {
    try {
      const response = await fetch(`https://api.real-payment-service.com/v1/transactions/${transactionId}`, {
        method: 'GET', // hoặc POST nếu cần
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_API_KEY', nếu cần
        },
      });
      
      if (response.ok) {
        const data = await response.json();
  
        if (data.status === 'expired') {
          alert('The transaction has expired. Please initiate a new payment.');
        } else if (data.status === 'success') {
          alert('The transaction is successful. Proceed with the payment.');
        } else {
          alert('The transaction status is unknown. Please check again later.');
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      alert('An error occurred while checking the transaction status.');
    }
  }
  
}
