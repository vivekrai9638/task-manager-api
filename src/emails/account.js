const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = function (email, name) {
  sgMail.send({
    to: email,
    from: "kumarvivek8290@gmail.com",
    subject: "Welcome to TASK MANAGER",
    text: `It's great to have you on board ${name}. I hope you will love the TASK MANAGER application.`,
  });
};

const sendCancellationEmail = function (email, name) {
  sgMail.send({
    to: email,
    from: "kumarvivek8290@gmail.com",
    subject: "It's to early to leave..",
    text: "I wish you would have stayed for longer. Feel free to suggest any improvements. Hope to see you soon.",
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
