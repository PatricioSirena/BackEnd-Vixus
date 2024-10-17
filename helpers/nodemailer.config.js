const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.USER_NODEMAILER,
        pass: process.env.PASS_NODEMAILER,
    },
});

module.exports = transporter