// emailTemplates.js

// This function generates the email template with a dynamic link
function generatePasswordEmail(link) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; box-sizing: border-box; background-color: white; display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="80%" style="max-width: 400px; background-color: white; border-radius: 5px; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; margin: auto;">
    <tr>
      <td style="padding: 20px; display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 10%;">
        <div style="width: 100%; height: auto; display: flex; justify-content: center; align-items: center;">
          <img src="../../uploads/darkmode_logo.png" alt="" style="width: 100%; max-width: 100%; height: auto; margin: auto; display: block;">
        </div>
        <div style="width: 100%; text-align: center;">
          <h2 style="margin: 0;">Did you forget your password? No worries, you can click on the button to reset your password.</h2>
        </div>
        <a href=${link} style="width: 100%; text-decoration: none;">
          <div style="width: 100%; height: auto; background-color: #FCA702; font-size: 20px; display: flex; justify-content: center; align-items: center; border-radius: 10px; color: white; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">Reset Password</div>
        </a>
        <div style="width: 100%; text-align: center;">
          <p style="margin: 0;">NOTE: The link will expire in 5 minutes.</p>
        </div>
      </td>
    </tr>
  </table>

</body>
</html>

`;
}

module.exports = {
  generatePasswordEmail
};