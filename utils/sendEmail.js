const nodemailer = require("nodemailer");

const config = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    }
}
 
const transport = nodemailer.createTransport(config);

const sendEmail = async (data) => {
    const email = {...data, from: "yurii.kovalchuk@meta.ua"};
    await transport.sendMail(email);
    return true;
} 

module.exports = sendEmail;