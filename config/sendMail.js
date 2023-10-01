require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (email, subject, text) => {
  let mailOptions = {
    from: "funnylife0004@outlook.com",
    to: email,
    subject,
    text,
  };

  try {
    await sgMail.send(mailOptions);
    return { status: true };
  } catch (error) {
    return { status: false, error };
  }
};

module.exports = sendMail;
