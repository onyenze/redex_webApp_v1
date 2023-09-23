// emailTemplates.js

// This function generates the email template with a dynamic link
function generateDynamicEmail(link, firstname) {
    return `
    <!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white;">
    <tr>
      <td style="padding: 20px 0;">
        <center>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="80%" style="max-width: 400px;">
            <tr>
              <td style="text-align: center;">
                <img src="../../uploads/darkmode_logo.png" alt="" style="width: 30%; max-width: 100%; height: auto;">
              </td>
            </tr>
          </table>
        </center>
      </td>
    </tr>
  </table>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white;">
    <tr>
      <td style="padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Welcome on board Creativent👋🥳💥</h2>
        <h3 style="margin: 10px 0; font-size: 18px;">Dear ${firstname}, click on the button to Verify your email <span style="color: #FCA702;">Thank you!</span></h3>
        <a href=${link} style="text-decoration: none;">
          <button style="width: 80%; height: 40px; border-radius: 8px; border: none; background-color: #FCA702; color: white; font-size: 15px; margin: 10px auto; cursor: pointer; display: block;">Verify Email Address</button>
        </a>
      </td>
    </tr>
  </table>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgb(243, 242, 242);">
    <tr>
      <td style="padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px; border-bottom: 2px solid rgb(49, 48, 48);">Get in Touch</h2>
        <div style="margin: 10px 0;">
          <i class="fa-brands fa-facebook-f" style="font-size: 20px; margin: 0 5px;"></i>
          <i class="fa-brands fa-twitter" style="font-size: 20px; margin: 0 5px;"></i>
          <i class="fa-brands fa-instagram" style="font-size: 20px; margin: 0 5px;"></i>
        </div>
        <h5 style="margin: 10px 0; font-size: 16px;">If you encounter any issues or have questions, feel free to reach out to our support team at <a href="mailto:Creativent@email.com" style="color: blue; text-decoration: none;">Creativent@email.com</a>.</h5>
      </td>
    </tr>
  </table>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #303482; color: white;">
    <tr>
      <td style="padding: 10px; text-align: center;">
        <p style="margin: 0; font-size: 10px;">© 2023 Creativent.ng. All Rights Reserved.</p>
      </td>
    </tr>
  </table>

</body>
</html>

    `;
  }
  
  module.exports = {
    generateDynamicEmail,
  };