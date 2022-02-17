const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv')

dotenv.config()

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, GMAIL_USER } = process.env

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendMail = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAUTH2',
        user: GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    })

    const mailOptions = {
      from: `GMail API <${GMAIL_USER}>`,
      to: 'receiver@domain.com',
      subject: 'GMail API with OAuth2',
      text: 'Email content in text',
      html: `<h1>Email content in HTML</h1>`,
    }

    const res = await transport.sendMail(mailOptions)

    return res
  } catch (err) {
    return err
  }
}

sendMail()
  .then((res) => console.log('E-mail successfully sent!\n', res))
  .catch((err) => console.log(err))
