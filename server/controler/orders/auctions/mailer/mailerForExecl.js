const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;

const CLIENT_SECRET = process.env.CLIENT_SECRET;

const REDIRECT_URI = process.env.REDIRECT_URI;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
function generateInvoiceId() {
  const uniqueId = uuidv4(); // Generate a UUID
  return `INV-${uniqueId}`;
}
exports.sendMailExecl = async (userEmail, order, orderDetailSummary) => {
  try {
    const invoiceId = generateInvoiceId();
    const accesToken = await oAuth2Client.getAccessToken();
    if (!accesToken.token) {
      throw new Error("Failed to retrieve access token");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",

      // Use `true` for port 465, `false` for all other ports
      auth: {
        type: "OAuth2",

        user: "haotri335@gmail.com",
        pass: "krgr nnlr bmfu mpwl",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: REDIRECT_URI,
        refreshToken: REFRESH_TOKEN,
        accessToken: accesToken,
      },

      // sendOrderConfirmationEmail()
    });

    // console.log(transporter);

    const mailOptions = {
      from: "haotri335@gmail.com",
      to: `${userEmail}`,
      subject: "E-COM",
      html: `
   <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <!--[if !mso]>-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="x-apple-disable-message-reformatting" content="" />
    <meta content="target-densitydpi=device-dpi" name="viewport" />
    <meta content="true" name="HandheldFriendly" />
    <meta content="width=device-width" name="viewport" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no, url=no"
    />
    <style type="text/css">
      table {
        border-collapse: separate;
        table-layout: fixed;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      table td {
        border-collapse: collapse;
      }
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      body,
      a,
      li,
      p,
      h1,
      h2,
      h3 {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      html {
        -webkit-text-size-adjust: none !important;
      }
      body,
      #innerTable {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      #innerTable img + div {
        display: none;
        display: none !important;
      }
      img {
        margin: 0;
        padding: 0;
        -ms-interpolation-mode: bicubic;
      }
      h1,
      h2,
      h3,
      p,
      a {
        line-height: inherit;
        overflow-wrap: normal;
        white-space: normal;
        word-break: break-word;
      }
      a {
        text-decoration: none;
      }
      h1,
      h2,
      h3,
      p {
        min-width: 100% !important;
        width: 100% !important;
        max-width: 100% !important;
        display: inline-block !important;
        border: 0;
        padding: 0;
        margin: 0;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      u + #body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
      a[href^="mailto"],
      a[href^="tel"],
      a[href^="sms"] {
        color: inherit;
        text-decoration: none;
      }
    </style>
    <style type="text/css">
      @media (min-width: 481px) {
        .hd {
          display: none !important;
        }
      }
    </style>
    <style type="text/css">
      @media (max-width: 480px) {
        .hm {
          display: none !important;
        }
      }
    </style>
    <style type="text/css">
      @media (max-width: 480px) {
        .t70 {
          mso-line-height-alt: 0px !important;
          line-height: 0 !important;
          display: none !important;
        }
        .t71 {
          padding-left: 30px !important;
          padding-bottom: 40px !important;
          padding-right: 30px !important;
          width: 420px !important;
        }
        .t68 {
          width: 353px !important;
        }
        .t11,
        .t110,
        .t113,
        .t119,
        .t121,
        .t14,
        .t18,
        .t21,
        .t25,
        .t28,
        .t31,
        .t34,
        .t4,
        .t64,
        .t7,
        .t74 {
          width: 420px !important;
        }
        .t4 {
          padding-bottom: 20px !important;
        }
        .t3 {
          line-height: 28px !important;
          font-size: 26px !important;
          letter-spacing: -1.04px !important;
        }
        .t121 {
          padding: 40px 30px !important;
        }
        .t110 {
          padding-bottom: 36px !important;
        }
        .t106 {
          text-align: center !important;
        }
        .t101,
        .t103,
        .t38,
        .t40,
        .t44,
        .t46,
        .t51,
        .t53,
        .t77,
        .t79,
        .t83,
        .t85,
        .t89,
        .t91,
        .t95,
        .t97 {
          display: revert !important;
        }
        .t105,
        .t81,
        .t87,
        .t93,
        .t99 {
          vertical-align: top !important;
          width: 44px !important;
        }
        .t42,
        .t48,
        .t55 {
          vertical-align: middle !important;
        }
        .t1 {
          padding-bottom: 50px !important;
          width: 80px !important;
        }
        .t60 {
          width: 380px !important;
        }
        .t56 {
          text-align: left !important;
        }
        .t48 {
          width: 620px !important;
        }
        .t45 {
          padding-left: 0 !important;
        }
        .t55 {
          width: 388px !important;
        }
        .t42 {
          width: 221px !important;
        }
      }
    </style>
    <!--[if !mso]>-->
    <link
      href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;700;800&amp;display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->
    <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
  </head>
  <body
    id="body"
    class="t125"
    style="
      min-width: 100%;
      margin: 0px;
      padding: 0px;
      background-color: #242424;
    "
  >
    <div class="t124" style="background-color: #242424">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        align="center"
      >
        <tr>
          <td
            class="t123"
            style="
              font-size: 0;
              line-height: 0;
              mso-line-height-rule: exactly;
              background-color: #242424;
            "
            valign="top"
            align="center"
          >
            <!--[if mso]>
              <v:background
                xmlns:v="urn:schemas-microsoft-com:vml"
                fill="true"
                stroke="false"
              >
                <v:fill color="#242424" />
              </v:background>
            <![endif]-->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              align="center"
              id="innerTable"
            >
              <tr>
                <td>
                  <div
                    class="t70"
                    style="
                      mso-line-height-rule: exactly;
                      mso-line-height-alt: 45px;
                      line-height: 45px;
                      font-size: 1px;
                      display: block;
                    "
                  >
                    &nbsp;&nbsp;
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <table
                    class="t72"
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    style="margin-left: auto; margin-right: auto"
                  >
                    <tr>
                      <!--[if mso]>
<td width="600" class="t71" style="background-color:#F8F8F8;padding:0 50px 60px 50px;">
<![endif]-->
                      <!--[if !mso]>-->
                      <td
                        class="t71"
                        style="
                          background-color: #f8f8f8;
                          width: 500px;
                          padding: 0 50px 60px 50px;
                        "
                      >
                        <!--<![endif]-->
                        <table
                          role="presentation"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          style="width: 100% !important"
                        >
                          <tr>
                            <td align="left">
                              <table
                                class="t2"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="130" class="t1" style="padding:0 0 60px 0;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t1"
                                    style="width: 130px; padding: 0 0 60px 0"
                                  >
                                    <!--<![endif]-->
                                    <div style="font-size: 0px">
                                      <img
                                        class="t0"
                                        style="
                                          display: block;
                                          border: 0;
                                          height: auto;
                                          width: 100%;
                                          margin: 0;
                                          max-width: 100%;
                                        "
                                        width="130"
                                        height="130"
                                         src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/logo%2Flogos2.png?alt=media&token=7ee844e9-8d47-46c6-a49a-db43773a5109"
                                            alt="Logo"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t5"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t4" style="padding:0 0 15px 0;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t4"
                                    style="width: 500px; padding: 0 0 15px 0"
                                  >
                                    <!--<![endif]-->
                                    <h1
                                      class="t3"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 26px;
                                        font-weight: 800;
                                        font-style: normal;
                                        font-size: 24px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -1.56px;
                                        direction: ltr;
                                        color: #191919;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 1px;
                                      "
                                    >
                                     Xác nhận bưu kiện 
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t8"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t7" style="padding:0 0 22px 0;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t7"
                                    style="width: 500px; padding: 0 0 22px 0"
                                  >
                                    <!--<![endif]-->
                                    <p
                                      class="t6"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                Chúng tôi xin thông báo rằng bưu kiện của bạn đã được gửi thành công đến địa chỉ yêu cầu.
                                Chúng tôi rất vui khi có cơ hội phục vụ bạn và hy vọng bạn sẽ hài lòng với sản phẩm. 
                                Nếu bạn cần bất kỳ sự hỗ trợ nào hoặc có câu hỏi về đơn hàng của mình, xin vui lòng liên hệ với chúng tôi.
                                Một lần nữa, xin cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi
                                Dưới đây là phần chi tiết đơn hàng gửi đến .


                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t12"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t11">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t11" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t10"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      <span
                                        class="t9"
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: bold;
                                          mso-line-height-rule: exactly;
                                        "
                                        >Mã đơn hàng</span
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t15"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t14" style="padding:0 0 22px 0;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t14"
                                    style="width: 500px; padding: 0 0 22px 0"
                                  >
                                    <!--<![endif]-->
                                    <p
                                      class="t13"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                   INV-${order._id}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t19"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t18">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t18" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t17"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      <span
                                        class="t16"
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: bold;
                                          mso-line-height-rule: exactly;
                                        "
                                        >Số hiệu theo dõi đơn hàng</span
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t22"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t21" style="padding:0 0 22px 0;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t21"
                                    style="width: 500px; padding: 0 0 22px 0"
                                  >
                                    <!--<![endif]-->
                                    <p
                                      class="t20"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                     ${invoiceId}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t26"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t25">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t25" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t24"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      <span
                                        class="t23"
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: bold;
                                          mso-line-height-rule: exactly;
                                        "
                                        >Địa chỉ giao hàng</span
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t29"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t28">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t28" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t27"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                        ${order.shippingAddress?.address}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t32"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t31">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t31" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t30"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t35"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t34">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t34" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t33"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                        Việt Nam
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t36"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 30px;
                                  line-height: 30px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;&nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t61"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t60" style="background-color:#FFFFFF;padding:20px 20px 20px 20px;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t60"
                                    style="
                                      background-color: #ffffff;
                                      width: 460px;
                                      padding: 20px 20px 20px 20px;
                                    "
                                  >
                                    <!--<![endif]-->
                                      <div style="width: 100%; text-align: left">
      ${orderDetailSummary
        .map(
          (item) => `
        <div class="t59" style="width: 100%; text-align: left">
          <div class="t58" style="display: inline-block">
            <table class="t57" role="presentation" cellpadding="0" cellspacing="0" align="left" valign="middle">
              <tr class="t56">
                <td></td>
                <td class="t42" width="99.09324" valign="middle">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t41" style="width: 100%">
                    <tr>
                      <td class="t38" style="width: 10px" width="10"></td>
                      <td class="t39">
                        <div style="font-size: 0px">
                          <img class="t37" style="display: block; border: 0; height: auto; width: 100%; margin: 0; max-width: 100%;" 
                               width="79.09324208725407" height="105.859375" alt="${item.productName}" src="${item.image}" />
                        </div>
                      </td>
                      <td class="t40" style="width: 10px" width="10"></td>
                    </tr>
                  </table>
                </td>
                <td class="t48" width="256.09923" valign="middle">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t47" style="width: 100%">
                    <tr>
                      <td class="t44" style="width: 10px" width="10"></td>
                      <td class="t45" style="padding: 0 0 0 24px">
                        <h1 class="t43" style="margin: 0; font-family: Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif; line-height: 16px; font-weight: 700; font-size: 14px; text-transform: uppercase; color: #1a1a1a;">
                          ${item.productName}
                        </h1>
                      </td>
                      <td class="t46" style="width: 10px" width="10"></td>
                    </tr>
                  </table>
                </td>
                <td class="t55" width="164.80753" valign="middle">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t54" style="width: 100%">
                    <tr>
                      <td class="t51" style="width: 10px" width="10"></td>
                      <td class="t52">
                        <p class="t50" style="margin: 0; font-family: Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif; line-height: 22px; font-weight: 500; font-size: 14px; text-transform: uppercase; color: #333333; text-align: right;">
                          Số lượng: <span class="t49" style="font-weight: bold;">${item.quantity}</span>
                        </p>
                      </td>
                      <td class="t53" style="width: 10px" width="10"></td>
                    </tr>
                  </table>
                </td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t62"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 30px;
                                  line-height: 30px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;&nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t65"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t64">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t64" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t63"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 14px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                     
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t66"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 40px;
                                  line-height: 40px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;&nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td align="left">
                              <table
                                class="t69"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="250" class="t68" style="background-color:#181818;overflow:hidden;text-align:center;line-height:44px;mso-line-height-rule:exactly;mso-text-raise:10px;border-radius:44px 44px 44px 44px;">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t68"
                                    style="
                                      background-color: #181818;
                                      overflow: hidden;
                                      width: 250px;
                                      text-align: center;
                                      line-height: 44px;
                                      mso-line-height-rule: exactly;
                                      mso-text-raise: 10px;
                                      border-radius: 44px 44px 44px 44px;
                                    "
                                  >
                                    <!--<![endif]-->
                                    <a
                                      class="t67"
                                      href="http://localhost:3150/auction?_sort=product_price%3AASC&page=1"
                                      style="
                                        display: block;
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 44px;
                                        font-weight: 800;
                                        font-style: normal;
                                        font-size: 12px;
                                        text-decoration: none;
                                        text-transform: uppercase;
                                        letter-spacing: 2.4px;
                                        direction: ltr;
                                        color: #f8f8f8;
                                        text-align: center;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 10px;
                                      "
                                      target="_blank"
                                      >Tiếp tục mua sắm</a
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <table
                    class="t122"
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    style="margin-left: auto; margin-right: auto"
                  >
                    <tr>
                      <!--[if mso]>
<td width="600" class="t121" style="background-color:#242424;padding:48px 50px 48px 50px;">
<![endif]-->
                      <!--[if !mso]>-->
                      <td
                        class="t121"
                        style="
                          background-color: #242424;
                          width: 500px;
                          padding: 48px 50px 48px 50px;
                        "
                      >
                        <!--<![endif]-->
                        <table
                          role="presentation"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          style="width: 100% !important"
                        >
                          <tr>
                            <td align="center">
                              <table
                                class="t75"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t74">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t74" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t73"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 800;
                                        font-style: normal;
                                        font-size: 18px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.9px;
                                        direction: ltr;
                                        color: #757575;
                                        text-align: center;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 1px;
                                      "
                                    >
                                     Hãy đăng nhập để đặt đơn hàng và nhận những thông tin về giá thành của sản phẩm
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t111"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
                                                            <td width="500" class="t110" style="padding:10px 0 44px 0;">
                                                    <![endif]-->
                                  <!--[if !mso]>-->
                                  <td
                                    class="t110"
                                    style="width: 500px; padding: 10px 0 44px 0"
                                  >
                                    <!--<![endif]-->
                                    <div
                                      class="t109"
                                      style="width: 100%; text-align: center"
                                    >
                                      <div
                                        class="t108"
                                        style="display: inline-block"
                                      >
                                        <table
                                          class="t107"
                                          role="presentation"
                                          cellpadding="0"
                                          cellspacing="0"
                                          align="center"
                                          valign="top"
                                        >
                                          <tr class="t106">
                                            <td></td>
                                            <td
                                              class="t81"
                                              width="44"
                                              valign="top"
                                            >
                                              <table
                                                role="presentation"
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="t80"
                                                style="width: 100%"
                                              >
                                                <tr>
                                                  <td
                                                    class="t77"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                  <td class="t78">
                                                    <div style="font-size: 0px">
                                                      <img
                                                        class="t76"
                                                        style="
                                                          display: block;
                                                          border: 0;
                                                          height: auto;
                                                          width: 100%;
                                                          margin: 0;
                                                          max-width: 100%;
                                                        "
                                                        width="24"
                                                        height="24"
                                                        alt=""
                                                        src="https://a1f898de-5c24-484f-82f0-a47a2ce1c407.b-cdn.net/e/2a2045dc-848b-4b42-82c9-19679c346752/8d668971-5312-4680-8eeb-e03b6a6b6940.png"
                                                      />
                                                    </div>
                                                  </td>
                                                  <td
                                                    class="t79"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td
                                              class="t87"
                                              width="44"
                                              valign="top"
                                            >
                                              <table
                                                role="presentation"
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="t86"
                                                style="width: 100%"
                                              >
                                                <tr>
                                                  <td
                                                    class="t83"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                  <td class="t84">
                                                    <div style="font-size: 0px">
                                                      <img
                                                        class="t82"
                                                        style="
                                                          display: block;
                                                          border: 0;
                                                          height: auto;
                                                          width: 100%;
                                                          margin: 0;
                                                          max-width: 100%;
                                                        "
                                                        width="24"
                                                        height="24"
                                                        alt=""
                                                        src="https://a1f898de-5c24-484f-82f0-a47a2ce1c407.b-cdn.net/e/2a2045dc-848b-4b42-82c9-19679c346752/619a4bc0-6689-4c36-bdea-d9a1f0071233.png"
                                                      />
                                                    </div>
                                                  </td>
                                                  <td
                                                    class="t85"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td
                                              class="t93"
                                              width="44"
                                              valign="top"
                                            >
                                              <table
                                                role="presentation"
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="t92"
                                                style="width: 100%"
                                              >
                                                <tr>
                                                  <td
                                                    class="t89"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                  <td class="t90">
                                                    <div style="font-size: 0px">
                                                      <img
                                                        class="t88"
                                                        style="
                                                          display: block;
                                                          border: 0;
                                                          height: auto;
                                                          width: 100%;
                                                          margin: 0;
                                                          max-width: 100%;
                                                        "
                                                        width="24"
                                                        height="24"
                                                        alt=""
                                                        src="https://a1f898de-5c24-484f-82f0-a47a2ce1c407.b-cdn.net/e/2a2045dc-848b-4b42-82c9-19679c346752/64248151-fa6a-40d1-ae6d-b5be6270db98.png"
                                                      />
                                                    </div>
                                                  </td>
                                                  <td
                                                    class="t91"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td
                                              class="t99"
                                              width="44"
                                              valign="top"
                                            >
                                              <table
                                                role="presentation"
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="t98"
                                                style="width: 100%"
                                              >
                                                <tr>
                                                  <td
                                                    class="t95"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                  <td class="t96">
                                                    <div style="font-size: 0px">
                                                      <img
                                                        class="t94"
                                                        style="
                                                          display: block;
                                                          border: 0;
                                                          height: auto;
                                                          width: 100%;
                                                          margin: 0;
                                                          max-width: 100%;
                                                        "
                                                        width="24"
                                                        height="24"
                                                        alt=""
                                                        src="https://a1f898de-5c24-484f-82f0-a47a2ce1c407.b-cdn.net/e/2a2045dc-848b-4b42-82c9-19679c346752/622b291f-70e0-4782-91f9-9ef0e9b054b4.png"
                                                      />
                                                    </div>
                                                  </td>
                                                  <td
                                                    class="t97"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td
                                              class="t105"
                                              width="44"
                                              valign="top"
                                            >
                                              <table
                                                role="presentation"
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="t104"
                                                style="width: 100%"
                                              >
                                                <tr>
                                                  <td
                                                    class="t101"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                  <td class="t102">
                                                    <div style="font-size: 0px">
                                                      <img
                                                        class="t100"
                                                        style="
                                                          display: block;
                                                          border: 0;
                                                          height: auto;
                                                          width: 100%;
                                                          margin: 0;
                                                          max-width: 100%;
                                                        "
                                                        width="24"
                                                        height="24"
                                                        alt=""
                                                        src="https://a1f898de-5c24-484f-82f0-a47a2ce1c407.b-cdn.net/e/2a2045dc-848b-4b42-82c9-19679c346752/986a7767-e9ee-4eb9-98b0-34dd3a0e1336.png"
                                                      />
                                                    </div>
                                                  </td>
                                                  <td
                                                    class="t103"
                                                    style="width: 10px"
                                                    width="10"
                                                  ></td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td></td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t114"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t113">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t113" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t112"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 12px;
                                        text-decoration: none;
                                        text-transform: none;
                                        direction: ltr;
                                        color: #888888;
                                        text-align: center;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 3px;
                                      "
                                    >
                                    
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                class="t120"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-left: auto; margin-right: auto"
                              >
                                <tr>
                                  <!--[if mso]>
<td width="500" class="t119">
<![endif]-->
                                  <!--[if !mso]>-->
                                  <td class="t119" style="width: 500px">
                                    <!--<![endif]-->
                                    <p
                                      class="t118"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family: Albert Sans,
                                          BlinkMacSystemFont, Segoe UI,
                                          Helvetica Neue, Arial, sans-serif;
                                        line-height: 22px;
                                        font-weight: 500;
                                        font-style: normal;
                                        font-size: 12px;
                                        text-decoration: none;
                                        text-transform: none;
                                        direction: ltr;
                                        color: #888888;
                                        text-align: center;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 3px;
                                      "
                                    >
                                      <a
                                        class="t115"
                                        href="https://tabular.email"
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: 700;
                                          font-style: normal;
                                          text-decoration: none;
                                          direction: ltr;
                                          color: #888888;
                                          mso-line-height-rule: exactly;
                                        "
                                        target="_blank"
                                        >Unsubscribe</a
                                      >&nbsp; •&nbsp;
                                      <a
                                        class="t116"
                                        href=""
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: 700;
                                          font-style: normal;
                                          text-decoration: none;
                                          direction: ltr;
                                          color: #888888;
                                          mso-line-height-rule: exactly;
                                        "
                                        target="_blank"
                                        >Quyền riêng tư</a
                                      >&nbsp; •&nbsp;
                                      <a
                                        class="t117"
                                        href=""
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: 700;
                                          font-style: normal;
                                          text-decoration: none;
                                          direction: ltr;
                                          color: #878787;
                                          mso-line-height-rule: exactly;
                                        "
                                        target="_blank"
                                        >Liên hệ</a
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    <div
      class="gmail-fix"
      style="
        display: none;
        white-space: nowrap;
        font: 15px courier;
        line-height: 0;
      "
    >
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>
  </body>
  
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      //   console.log("Email sent: " + info.response);
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
