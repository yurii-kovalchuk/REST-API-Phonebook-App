const nodemailer = require("nodemailer");

const {META_PASS} = process.env;

const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "yurii.kovalchuk@meta.ua",
        pass: META_PASS
    }
}

const transport = nodemailer.createTransport(config);

const sendMail = async (data) => {
    const email = {...data, from: "yurii.kovalchuk@meta.ua"};
    await transport.sendMail(email);
    return true;
} 

module.exports = sendMail;