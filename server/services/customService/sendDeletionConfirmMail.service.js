const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");

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

const sendDeletionConfirmationEmail = async (userEmail, serviceDetails , customerSelect) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken.token) {
      throw new Error("Failed to retrieve access token");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "haotri335@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: "haotri335@gmail.com",
      to: userEmail,
      subject: "E-COM",
      html:   `  

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
    .gmail-mobile-forced-width {
      display: none;
      display: none !important;
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
      .t29,
      .t32,
      .t5,
      .t9 {
        width: 398px !important;
      }
      .t31,
      .t34 {
        mso-line-height-alt: 0px !important;
        line-height: 0 !important;
        display: none !important;
      }
      .t32 {
        padding: 40px !important;
        border-radius: 0 !important;
      }
      .t24 {
        text-align: left !important;
      }
      .t17 {
        display: revert !important;
      }
      .t19,
      .t23 {
        vertical-align: top !important;
        width: auto !important;
        max-width: 100% !important;
      }
    }
  </style>
  <style type="text/css">
    @media (max-width: 480px) {
      [class~="x_t31"] {
        mso-line-height-alt: 0px !important;
        line-height: 0px !important;
        display: none !important;
      }
      [class~="x_t34"] {
        mso-line-height-alt: 0px !important;
        line-height: 0px !important;
        display: none !important;
      }
      [class~="x_t32"] {
        padding-left: 40px !important;
        padding-top: 40px !important;
        padding-bottom: 40px !important;
        padding-right: 40px !important;
        border-top-left-radius: 0px !important;
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
        width: 398px !important;
      }
      [class~="x_t5"] {
        width: 398px !important;
      }
      [class~="x_t9"] {
        width: 398px !important;
      }
      [class~="x_t29"] {
        width: 398px !important;
      }
      [class~="x_t24"] {
        text-align: left !important;
      }
      [class~="x_t17"] {
        display: revert !important;
      }
      [class~="x_t19"] {
        vertical-align: top !important;
        width: auto !important;
        max-width: 100% !important;
      }
      [class~="x_t23"] {
        vertical-align: top !important;
        width: auto !important;
        max-width: 100% !important;
      }
    }
  </style>
  <!--[if !mso]>-->
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&amp;family=Sofia+Sans:wght@700&amp;family=Open+Sans:wght@400;500;600&amp;display=swap"
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
  class="t37"
  style="
    min-width: 100%;
    margin: 0px;
    padding: 0px;
    background-color: #ffffff;
  "
>
  <div class="t36" style="background-color: #ffffff">
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
          class="t35"
          style="
            font-size: 0;
            line-height: 0;
            mso-line-height-rule: exactly;
            background-color: #ffffff;
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
              <v:fill color="#FFFFFF" />
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
                  class="t31"
                  style="
                    mso-line-height-rule: exactly;
                    mso-line-height-alt: 50px;
                    line-height: 50px;
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
                  class="t33"
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  style="margin-left: auto; margin-right: auto"
                >
                  <tr>
                    <!--[if mso]>
<td width="600" class="t32" style="background-color:#FFFFFF;border:1px solid #EBEBEB;overflow:hidden;padding:44px 42px 32px 42px;border-radius:3px 3px 3px 3px;">
<![endif]-->
                    <!--[if !mso]>-->
                    <td
                      class="t32"
                      style="
                        background-color: #ffffff;
                        border: 1px solid #ebebeb;
                        overflow: hidden;
                        width: 514px;
                        padding: 44px 42px 32px 42px;
                        border-radius: 3px 3px 3px 3px;
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
<td width="42" class="t1">
<![endif]-->
                                <!--[if !mso]>-->
                                <td class="t1" style="width: 42px">
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
                                      width="42"
                                      height="42"
                                     src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/logo%2Flogos.png?alt=media&token=078f5f5d-08f4-41e6-99c6-5f0a05afa74d"
                                          alt="Logo"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div
                              class="t3"
                              style="
                                mso-line-height-rule: exactly;
                                mso-line-height-alt: 42px;
                                line-height: 42px;
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
                              class="t6"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              style="margin-left: auto; margin-right: auto"
                            >
                              <tr>
                                <!--[if mso]>
<td width="514" class="t5" style="border-bottom:1px solid #EFF1F4;padding:0 0 18px 0;">
<![endif]-->
                                <!--[if !mso]>-->
                                <td
                                  class="t5"
                                  style="
                                    border-bottom: 1px solid #eff1f4;
                                    width: 514px;
                                    padding: 0 0 18px 0;
                                  "
                                >
                                  <!--<![endif]-->
                                  <h1
                                    class="t4"
                                    style="
                                      margin: 0;
                                      margin: 0;
                                      font-family: Montserrat,
                                        BlinkMacSystemFont, Segoe UI,
                                        Helvetica Neue, Arial, sans-serif;
                                      line-height: 28px;
                                      font-weight: 700;
                                      font-style: normal;
                                      font-size: 24px;
                                      text-decoration: none;
                                      text-transform: none;
                                      letter-spacing: -1px;
                                      direction: ltr;
                                      color: #141414;
                                      text-align: left;
                                      mso-line-height-rule: exactly;
                                      mso-text-raise: 1px;
                                    "
                                  >
                                 ${serviceDetails.service_name}
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div
                              class="t7"
                              style="
                                mso-line-height-rule: exactly;
                                mso-line-height-alt: 18px;
                                line-height: 18px;
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
                              class="t10"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              style="margin-left: auto; margin-right: auto"
                            >
                              <tr>
                                <!--[if mso]>
<td width="514" class="t9">
<![endif]-->
                                <!--[if !mso]>-->
                                <td class="t9" style="width: 514px">
                                  <!--<![endif]-->
                                  <p
                                    class="t8"
                                    style="
                                      margin: 0;
                                      margin: 0;
                                      font-family: Open Sans,
                                        BlinkMacSystemFont, Segoe UI,
                                        Helvetica Neue, Arial, sans-serif;
                                      line-height: 25px;
                                      font-weight: 400;
                                      font-style: normal;
                                      font-size: 15px;
                                      text-decoration: none;
                                      text-transform: none;
                                      letter-spacing: -0.1px;
                                      direction: ltr;
                                      color: #141414;
                                      text-align: left;
                                      mso-line-height-rule: exactly;
                                      mso-text-raise: 3px;
                                    "
                                  >
                               ${customerSelect.customerReson}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div
                              class="t12"
                              style="
                                mso-line-height-rule: exactly;
                                mso-line-height-alt: 24px;
                                line-height: 24px;
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
                              class="t14"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              style="margin-right: auto"
                            >
                              <tr>
                                <!--[if mso]>
<td class="t13" style="background-color:#0666EB;overflow:hidden;text-align:center;line-height:34px;mso-line-height-rule:exactly;mso-text-raise:5px;padding:0 23px 0 23px;border-radius:40px 40px 40px 40px;">
<![endif]-->
                                <!--[if !mso]>-->
                                <td
                                  class="t13"
                                  style="
                                    background-color: #0666eb;
                                    overflow: hidden;
                                    width: auto;
                                    text-align: center;
                                    line-height: 34px;
                                    mso-line-height-rule: exactly;
                                    mso-text-raise: 5px;
                                    padding: 0 23px 0 23px;
                                    border-radius: 40px 40px 40px 40px;
                                  "
                                >
                                  <!--<![endif]-->
                                  <span
                                    class="t11"
                                    style="
                                      display: block;
                                      margin: 0;
                                      margin: 0;
                                      font-family: Sofia Sans,
                                        BlinkMacSystemFont, Segoe UI,
                                        Helvetica Neue, Arial, sans-serif;
                                      line-height: 34px;
                                      font-weight: 700;
                                      font-style: normal;
                                      font-size: 16px;
                                      text-decoration: none;
                                      text-transform: none;
                                      letter-spacing: -0.2px;
                                      direction: ltr;
                                      color: #ffffff;
                                      text-align: center;
                                      mso-line-height-rule: exactly;
                                      mso-text-raise: 5px;
                                    "
                                    ><a href='http://localhost:3150/auction?_sort=product_price%3AASC&page=1'>Trở lại</a></span
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div
                              class="t28"
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
                          <td align="center">
                            <table
                              class="t30"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              style="margin-left: auto; margin-right: auto"
                            >
                              <tr>
                                <!--[if mso]>
<td width="514" class="t29" style="border-top:1px solid #DFE1E4;padding:24px 0 0 0;">
<![endif]-->
                                <!--[if !mso]>-->
                                <td
                                  class="t29"
                                  style="
                                    border-top: 1px solid #dfe1e4;
                                    width: 514px;
                                    padding: 24px 0 0 0;
                                  "
                                >
                                  <!--<![endif]-->
                                  <div
                                    class="t27"
                                    style="width: 100%; text-align: left"
                                  >
                                    <div
                                      class="t26"
                                      style="display: inline-block"
                                    >
                                      <table
                                        class="t25"
                                        role="presentation"
                                        cellpadding="0"
                                        cellspacing="0"
                                        align="left"
                                        valign="top"
                                      >
                                        <tr class="t24">
                                          <td></td>
                                          <td class="t19" valign="top">
                                            <table
                                              role="presentation"
                                              width="100%"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="t18"
                                              style="width: auto"
                                            >
                                              <tr>
                                                <td
                                                  class="t16"
                                                  style="
                                                    background-color: #ffffff;
                                                    text-align: center;
                                                    line-height: 20px;
                                                    mso-line-height-rule: exactly;
                                                    mso-text-raise: 2px;
                                                  "
                                                >
                                                  <span
                                                    class="t15"
                                                    style="
                                                      display: block;
                                                      margin: 0;
                                                      margin: 0;
                                                      font-family: Open Sans,
                                                        BlinkMacSystemFont,
                                                        Segoe UI,
                                                        Helvetica Neue, Arial,
                                                        sans-serif;
                                                      line-height: 20px;
                                                      font-weight: 600;
                                                      font-style: normal;
                                                      font-size: 14px;
                                                      text-decoration: none;
                                                      direction: ltr;
                                                      color: #222222;
                                                      text-align: center;
                                                      mso-line-height-rule: exactly;
                                                      mso-text-raise: 2px;
                                                    "
                                                    >E-com</span
                                                  >
                                                </td>
                                                <td
                                                  class="t17"
                                                  style="width: 20px"
                                                  width="20"
                                                ></td>
                                              </tr>
                                            </table>
                                          </td>
                                          <td class="t23" valign="top">
                                            <table
                                              role="presentation"
                                              width="100%"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="t22"
                                              style="width: auto"
                                            >
                                              <tr>
                                                <td
                                                  class="t21"
                                                  style="
                                                    background-color: #ffffff;
                                                    text-align: center;
                                                    line-height: 20px;
                                                    mso-line-height-rule: exactly;
                                                    mso-text-raise: 2px;
                                                  "
                                                >
                                                  <span
                                                    class="t20"
                                                    style="
                                                      display: block;
                                                      margin: 0;
                                                      margin: 0;
                                                      font-family: Open Sans,
                                                        BlinkMacSystemFont,
                                                        Segoe UI,
                                                        Helvetica Neue, Arial,
                                                        sans-serif;
                                                      line-height: 20px;
                                                      font-weight: 500;
                                                      font-style: normal;
                                                      font-size: 14px;
                                                      text-decoration: none;
                                                      direction: ltr;
                                                      color: #b4becc;
                                                      text-align: center;
                                                      mso-line-height-rule: exactly;
                                                      mso-text-raise: 2px;
                                                    "
                                                    ><a hreft="http://localhost:3150/auction?_sort=product_price%3AASC&page=1">Tiếp tục mua sắm</a></span
                                                  >
                                                </td>
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
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  class="t34"
                  style="
                    mso-line-height-rule: exactly;
                    mso-line-height-alt: 50px;
                    line-height: 50px;
                    font-size: 1px;
                    display: block;
                  "
                >
                  &nbsp;&nbsp;
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  <div
    class="gmail-mobile-forced-width"
    style="white-space: nowrap; font: 15px courier; line-height: 0"
  >
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  </div>
</body>

        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    throw new Error(
      `Error sending deletion confirmation email: ${error.message}`
    );
  }
};

module.exports = sendDeletionConfirmationEmail;

