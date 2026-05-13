const sgMail = require("@sendgrid/mail");

const sendEmail = async (options) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: options.to,
      from: {
        email: process.env.EMAIL_FROM || "begumnarmanli@gmail.com",
        name: "WorkSpace Reservations",
      },
      reply_to: process.env.EMAIL_FROM || "begumnarmanli@gmail.com",
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),

      tracking_settings: {
        click_tracking: { enable: false },
        open_tracking: { enable: false },
      },

      categories: ["reservation-confirmation"],
    };

    const response = await sgMail.send(msg);
    console.log("Email sent successfully to:", options.to);
    console.log("SendGrid Response Status:", response[0].statusCode);
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    if (error.response) {
      console.error(
        "Error details:",
        JSON.stringify(error.response.body, null, 2),
      );
    }
    return false;
  }
};

module.exports = sendEmail;
