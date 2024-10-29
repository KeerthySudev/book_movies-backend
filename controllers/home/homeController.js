const User = require("../../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//Generate a random number as otp-------
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}
const otp = generateOtp();

//Sending an otp to the registered email--------

const emailVerify = async (req, res) => {
  const email = req.body.email;

  // Create a Nodemailer transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  // Define the mail options
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `Your OTP code is ${otp}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).send("Error sending email: " + error.message);
  }
};

// Function to verify OTP---------

async function verifyOtp(req, res) {
  if (req.method === "POST") {
    const userOtp = req.body.otp;

    // Debugging: Log received OTP
    console.log("Received OTP:", userOtp);

    if (!userOtp) {
      console.error("OTP is missing");
      return res.status(400).send("OTP is required.");
    }

    // Debugging: Log stored OTP
    console.log("Stored OTP:", otp);

    // Check if the OTP exists and matches
    if (otp && otp === userOtp) {
      // OTP is valid
      console.log("OTP verification successful");
      return res.status(200).send("OTP verified successfully!");
    } else {
      // OTP is invalid
      console.error("Invalid OTP");
      return res.status(400).send("Invalid OTP.");
    }
  } else {
    console.error(`Method ${req.method} Not Allowed`);
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = { emailVerify, verifyOtp };
