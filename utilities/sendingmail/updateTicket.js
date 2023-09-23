

// This function generates the bar code  with the encoded data as parameter
function updatedTicketEmail(EventName, EventDescription,EventDate,EventTime,EventVenue,eventImages,organizersEmail) {return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body style="margin: 0; padding: 0; font-family: sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 0; background-color: #303482; color: white; font-size: 12px; border-radius: 90px 90px 0 0; text-align: center;">
        <h2 style="margin: 0; padding: 20px 0;">Ticket Update</h2>
      </td>
    </tr>
  </table>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white;">
    <tr>
      <td style="padding: 20px; text-align: center;">
        <h3 style="margin: 0; font-size: 18px; text-align: center;">Hey there! Your Event Organizer has made some changes to the Event you are anticpating  Here are the details:</h3>
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
                <img src=${eventImages} alt="eventImage" style="width: 100%; max-width: 100%; height: auto;border-radius: 20px;">
              </div>
             
              <div style="width: 100%; height: 13%; background-color:white; margin-top: 10px; display: flex; justify-content: center; color: black;">
                <p style="text-align: left;">We're looking forward to seeing you at the event. If you have any questions or need assistance, don't hesitate to reach out to our event organizers at <span style="color: rgb(7, 7, 145);">${organizersEmail}</span>.</p>
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


`}

module.exports = {
    updatedTicketEmail
};