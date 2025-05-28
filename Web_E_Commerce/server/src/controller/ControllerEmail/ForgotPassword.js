const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const ForgotPassword = async (email, token, otp) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USER_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const info = await transport.sendMail({
            from: `Apex Fashion" <${process.env.USER_EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: 'Forgot Password', // Subject line
            text: 'Hello world?', // plain text body
            html: `<b>
            Dear ${email}
            Mã OTP thiết lập lại mật khẩu là : ${otp}
            Token : ${token}
            </b>`,
        });
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

module.exports = ForgotPassword;
