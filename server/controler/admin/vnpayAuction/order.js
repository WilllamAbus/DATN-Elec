const crypto = require("crypto");
const config = require("../../../config/default.json");
const Order = require("../../../model/orders/orderCart/orders");
const querystring = require("qs");
const request = require("request");
const moment = require("moment");
// const Payment = require("../../../model/orders/payment.model");
const Vnpay = require("../../../model/orders/vnpay.model");
const {
  sendOrderConfirmationEmail,
} = require("../../../services/email.service");
const User = require("../../../model/users.model");
const productVariant = require("../../../model/product_v2/productVariant");
const Cart = require("../../../model/orders/cart.model");
const Payment = require("../../../model/orders/payment.model");
// Tạo URL thanh toán
exports.createPaymentUrl = (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language || "vn";
    let currCode = "VND";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.json({ paymentUrl: vnpUrl });
  } catch (error) {
    console.error("Create payment URL error:", error);
    res.status(500).json({ message: "Error creating VNPay payment URL" });
  }
};

exports.vnpayReturn = async (req, res) => {
  const vnp_Params = req.query;

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = sortObject(vnp_Params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const orderId = vnp_Params["vnp_TxnRef"];

    if (responseCode === "00") {
      const transactionNo = vnp_Params["vnp_TransactionNo"];
      const existingVnpay = await Vnpay.findOne({
        transaction: transactionNo,
      });

      if (existingVnpay) {
        return res.render("error", {
          code: "98",
          message: "Transaction already exists",
        });
      }

      const paymentData = {
        amount: parseInt(vnp_Params["vnp_Amount"]) / 100,
        transaction: transactionNo,
        bank_code: vnp_Params["vnp_BankCode"],
        card_type: vnp_Params["vnp_CardType"],
        order_info: vnp_Params["vnp_OrderInfo"],
        payment_date: vnp_Params["vnp_PayDate"],
        transaction_status: vnp_Params["vnp_TransactionStatus"],
        response_code: vnp_Params["vnp_ResponseCode"],
        payment_method: "vnPay", // Vì đây là VNPay
      };

      try {
        const newVnpay = new Vnpay(paymentData);
        await newVnpay.save();

        // Thay đổi URL chuyển hướng với id đơn hàng
        res.redirect(
          `http://localhost:3150/completeAuction/${orderId}?paymentResult=success&orderId=${transactionNo}`
        );
      } catch (error) {
        console.error("Lưu thanh toán thất bại:", error);
        res.redirect(
          `http://localhost:3150/completeAuction/${orderId}?paymentResult=failure`
        );
      }
    } else {
      res.redirect(
        `http://localhost:3150/completeAuction/${orderId}?paymentResult=failure`
      );
    }
  } else {
    res.redirect(
      `http://localhost:3150/completeAuction/${orderId}?paymentResult=invalid`
    );
  }
};

exports.vnpayIpn = (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];
  let orderId = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = config.get("vnp_HashSecret");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  let paymentStatus = "0";
  let checkOrderId = true;
  let checkAmount = true;

  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          if (rspCode == "00") {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};

exports.queryDr = (req, res) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "querydr";
  let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;
  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    (error, response, body) => {
      console.log(response);
    }
  );
};

exports.refund = (req, res) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = "VND";
  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "refund";
  let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;
  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");
  let vnp_TransactionNo = "0";

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TransactionType +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_Amount +
    "|" +
    vnp_TransactionNo +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateBy +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType,
    vnp_TxnRef,
    vnp_Amount,
    vnp_TransactionNo,
    vnp_CreateBy,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    (error, response, body) => {
      console.log(response);
    }
  );
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
// function sortObject(obj) {
//   let sorted = {};
//   let str = [];
//   for (let p in obj) {
//     if (obj.hasOwnProperty(p)) {
//       str.push(encodeURIComponent(p).toLowerCase() + "=" + encodeURIComponent(obj[p]).toLowerCase());
//     }
//   }
//   str.sort();
//   for (let i = 0; i < str.length; i++) {
//     let p = str[i].split("=");
//     sorted[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
//   }
//   return sorted;
// }
