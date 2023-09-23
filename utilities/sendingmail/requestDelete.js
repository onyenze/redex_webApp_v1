// emailTemplates.js

// This function generates the email template with a dynamic link
function requestDeleteEmail(firstname,ticketHoldersLength,link,EventName, EventDescription,EventDate,EventTime,EventVenue,eventImages) {
    return (`
    <!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 0; background-color: #303482; color: white; font-size: 12px; border-radius: 90px 90px 0 0; text-align: center;">
        <h2 style="margin: 0; padding: 20px 0;">Request to Delete Event</h2>
      </td>
    </tr>
  </table>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white;">
    <tr>
      <td style="padding: 20px; text-align: center;">
        <h3 style="margin: 0; font-size: 18px; text-align: center;"><h2>Dear ${firstname},</h2>
            We have recieved your request to delete the event below. Are you having troubles hosting this event? Or you having low ticket sales? Not a problem, At Creativents we take care of our own. We would suggest you reschedule/update the event to a better period and promote the event. We also understand if it is circumtances beyond your control, you should know that ${ticketHoldersLength} ticket holders would be refunded.</h3>
            <a href=${link} style="text-decoration: none;">
          <button style="width: 80%; height: 40px; border-radius: 8px; border: none; background-color: #FCA702; color: white; font-size: 15px; margin: 10px auto; cursor: pointer; display: block;">Update Event</button>
        </a>
      </td>
    </tr>
  </table>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white;">
    <tr>
      <td style="padding: 20px; text-align: center;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 400px; margin: 0 auto; background-color: white; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; border-radius: 10px;">
          <tr>
            <td style="padding: 20px;">
              <h4 style="color: rgb(73, 72, 72); margin: 10px 0;">Event Name: ${EventName} </h4>
              <h4 style="color: rgb(73, 72, 72); margin: 10px 0;">Description: ${EventDescription}</h4>
              <h4 style="color: rgb(73, 72, 72); margin: 10px 0;">Date and Time: ${EventDate} at ${EventTime}</h4>
              <h4 style="color: rgb(73, 72, 72); margin: 10px 0;">Venue: ${EventVenue}</h4>
              <div style="width: 100%; margin: 10px 0; text-align: center;">
                <img src=${eventImages} alt="eventImage" style="width: 100%; max-width: 100%; height: auto; border-radius: 20px;">
              </div>
              <p style="width: 100%; padding-left: 10px;">We require your reply to this mail as confirmation in order to proceed with this request, don't hesitate to reach out to our administrator at <span style="color: rgb(7, 7, 145);">creativentstca@gmail.com</span> or call: <span style="color: rgb(7, 7, 145);">09056929182</span>.</p>
              
              <div style="width: 100%; height: 13%; background-color: #303482; margin-top: 10px; display: flex; justify-content: center; color: white;">
                <p style="margin: 0; font-size: 10px; width: 80%; text-align: center;">Thank you for choosing Creativents. We look forward to creating more events with you!</p>
              </div>
            </td>
          </tr>
        </table>
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


 `);
  }
  
  module.exports = {
    requestDeleteEmail
  };