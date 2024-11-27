const crypto = require('crypto');
const dotenv = require("dotenv");
const moment = require("moment");
const request = require("request");
const querystring = require("querystring");

dotenv.config();

// Create Payment URL
exports.createPaymentUrl = async (totalPriceWithShipping, auctionID, orderInFo) => {
    // Validation and setup
    const createDate = moment().format("YYYYMMDDHHmmss");
    const ipAddr = 'unknown'; // This should be dynamically obtained if possible

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    // Construct the parameters
    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: auctionID.toString(),
        vnp_OrderInfo: orderInFo,
        vnp_OrderType: "other",
        vnp_Amount: totalPriceWithShipping.toString(),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    vnp_Params = sortObject(vnp_Params);

    const params = new URLSearchParams(vnp_Params);
    const signData = params.toString();

    try {
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;

        const finalParams = new URLSearchParams(vnp_Params);
        const paymentUrl = `${vnpUrl}?${finalParams.toString()}`;

        
        return { url: paymentUrl };
    } catch (error) {
        console.error("Error generating secure hash:", error);
        throw new Error('Failed to generate payment URL');
    }
};






// Handle VNPay Return URL
exports.vnpayReturn = (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
    } else {
        res.render("success", { code: "97" });
    }
};

// Handle VNPay IPN (Instant Payment Notification)
exports.vnpayIpn = (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });

    // Debugging output


    const secretKey = process.env.VNP_HASH_SECRET;
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        // Implement order checks and response handling
        res.status(200).json({ RspCode: rspCode, Message: "Success" });
    } else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }
};

// Query DR (Direct Refund) API
exports.queryDr = (req, res) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpApi = process.env.VNP_API;

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;

    const vnp_RequestId = moment(date).format("HHmmss");
    const vnp_Version = "2.1.0";
    const vnp_Command = "querydr";
    const vnp_OrderInfo = `Truy van GD ma:${vnp_TxnRef}`;
    const vnp_IpAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || 'unknown';
    const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    const data = [
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        tmnCode,
        vnp_TxnRef,
        vnp_TransactionDate,
        vnp_CreateDate,
        vnp_IpAddr,
        vnp_OrderInfo
    ].join('|');

    // Debugging output


    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

    const dataObj = {
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        vnp_TmnCode: tmnCode,
        vnp_TxnRef,
        vnp_TransactionDate,
        vnp_CreateDate,
        vnp_IpAddr,
        vnp_OrderInfo,
        vnp_SecureHash
    };

    request.post({
        url: vnpApi,
        json: true,
        body: dataObj
    }, (error, response, body) => {
        if (error) {
            console.error("Request error:", error);
            return res.status(500).json({ RspCode: "99", Message: "Internal server error" });
        }
        res.status(200).json(body);
    });
};

// Refund API
exports.refund = (req, res) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpApi = process.env.VNP_API;

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_Amount = req.body.amount ;
    const vnp_TransactionType = req.body.transType;
    const vnp_CreateBy = req.body.user;

    const currCode = "VND";
    const vnp_RequestId = moment(date).format("HHmmss");
    const vnp_Version = "2.1.0";
    const vnp_Command = "refund";
    const vnp_OrderInfo = `Hoan tien GD ma:${vnp_TxnRef}`;
    const vnp_IpAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || 'unknown';
    const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    const data = [
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        tmnCode,
        vnp_TxnRef,
        vnp_Amount,
        vnp_Amount,
        currCode,
        vnp_TransactionType,
        vnp_CreateBy,
        vnp_OrderInfo,
        vnp_IpAddr,
        vnp_CreateDate
    ].join('|');

    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

    const dataObj = {
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        vnp_TmnCode: tmnCode,
        vnp_TxnRef,
        vnp_Amount,
        vnp_CurrCode: currCode,
        vnp_TransactionType,
        vnp_CreateBy,
        vnp_OrderInfo,
        vnp_IpAddr,
        vnp_CreateDate,
        vnp_SecureHash
    };

    request.post({
        url: vnpApi,
        json: true,
        body: dataObj
    }, (error, response, body) => {
        if (error) {
            console.error("Request error:", error);
            return res.status(500).json({ RspCode: "99", Message: "Internal server error" });
        }
        res.status(200).json(body);
    });
};

// Utility Function to Sort Object Keys
const sortObject = (obj) => {
    return Object.keys(obj).sort().reduce((sortedObj, key) => {
        sortedObj[key] = obj[key];
        return sortedObj;
    }, {});
};