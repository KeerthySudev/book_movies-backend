const twilio = require("twilio");

//handler for sending booking details in whatsapp-----

const handler = async (req, res) => {
  if (req.method === "POST") {
    const {
      phoneNumber,
      movie,
      seatIDs,
      theatre,
      showtime,
      showdate,
      totalPrice,
    } = req.body;
    const message = `Booking confirmed.\n
Your show "${movie}" is scheduled.\n
Theatre: ${theatre}\n
Date: ${showdate}\n
Time: ${showtime}\n
Seats: ${seatIDs}\n
Total Amount: Rs${totalPrice}.`;

    try {
      // Twilio credentials
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);

      // Twilio WhatsApp number
      const whatsappFrom = "whatsapp:+14155238886";

      const whatsappTo = `whatsapp:${phoneNumber}`;

      // Send WhatsApp message
      const messageResponse = await client.messages.create({
        body: message,
        from: whatsappFrom,
        to: whatsappTo,
      });

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: messageResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error sending message",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

module.exports = { handler };
