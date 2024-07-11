// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const dotenv = require("dotenv");

// dotenv.config();
// const CLIENT_ID = process.env.CLIENT_ID;

// const CLIENT_SECRET = process.env.CLIENT_SECRET;

// const REDIRECT_URI = process.env.REDIRECT_URI;

// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// exports.sendMail = async (userEmail, orderDetails) => {
//   try {
//     const accesToken = await oAuth2Client.getAccessToken();
//     if (!accesToken.token) {
//       throw new Error("Failed to retrieve access token");
//     }
//     const transporter = nodemailer.createTransport({
//       service: "gmail",

//       // Use `true` for port 465, `false` for all other ports
//       auth: {
//         type: "OAuth2",

//         user: "haotri335@gmail.com",
//         pass: "krgr nnlr bmfu mpwl",
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         redirectUri: REDIRECT_URI,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accesToken,
//       },

//       // sendOrderConfirmationEmail()
//     });

//     // console.log(transporter);

//     const mailOptions = {
//       from: "haotri335@gmail.com",
//       to: `${userEmail}`,
//       subject: "XÁC NHẬN THANH TOÁN",
//       text: ` CHI TIẾT HÓA ĐƠN CỦA BẠN TẠI ĐÂY: ${JSON.stringify(
//         orderDetails
//       )}`,
//       // You can also use HTML content
//       html: `  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//     <h2 style="color: #4CAF50;">CẢM ƠN QUÝ KHÁCH !!!</h2>
   

//     <h3 style="color:black; ">Tổng hóa đơn</h3>
//     <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <thead>
//             <tr>
//                 <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">SẢN PHẨM</th>
//                 <th style="text-align: right; border-bottom: 2px solid #ddd; padding: 8px;">SỐ LƯỢNG</th>
//                 <th style="text-align: right; border-bottom: 2px solid #ddd; padding: 8px;">GIÁ</th>
//             </tr>
//         </thead>
//         <tbody>
//             ${orderDetails.product_name
//               .split(", ")
//               .map((product) => {
//                 const [name, quantity] = product.split("(");
//                 return `
//                     <tr>
//                         <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name.trim()}</td>
//                         <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${quantity
//                           .replace(")", "")
//                           .trim()}</td>
//                         <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${orderDetails.total.toLocaleString(
//                           "vi-VN",
//                           { style: "currency", currency: "VND" }
//                         )}</td>
//                     </tr>
//                 `;
//               })
//               .join("")}
//         </tbody>
//     </table>
//     <p><strong>THANH TOÁN:</strong> ${orderDetails.total.toLocaleString(
//       "vi-VN",
//       { style: "currency", currency: "VND" }
//     )}</p>
//     <p>ĐỊA CHỈ NHẬN HÀNG: ${orderDetails.address}</p>

//     <p style="color:black; ">CẢM ƠN QUÝ KHÁCH</p>
//     <p style="color:black; ">CHÚC QUÝ KHÁCH CÓ TRẢI NGHIỆM MUA SẮM THẬT TUYỆT VỜI</p>
//     <p style="color:golden; ">FRUIT SHOP</p>
// </div>`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return console.log(error);
//       }
//       console.log("Email sent: " + info.response);
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };
