import express from 'express';
import conn from '../../sql.js';
import nodemailer from 'nodemailer'
``
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'brhma@megaaopes.com',
        pass: 'B^hM@mos#24',
    },
});



// router.get('/', async (req, res) => {

//     const mailOptions = {
//         from: 'sathiskumar.r@megaaopes.com',
//         to: 'sathiskumar.r@megaaopes.com',
//         subject: 'Welcome to the Team!',
//         html: `<h1>Welcome! Sathis kumar , Babuuuuu.....</h1>
//                <p>We are excited to have you on board.</p>
//                <p>Best regards,</p>
//                <p>Your Company</p>`,
//         // attachments: [
//         //     {
//         //         filename: 'onboarding-image.png',
//         //         path: './path/to/onboarding-image.png',
//         //         cid: 'image1',
//         //     },
//         // ],
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Mapla email odiruchu da ')
//     } catch (error) {
//         console.error('Something went wrong mapla', error)
//         res.send(500).send('Failed to sent email ')
//     }


// })





router.post('/', (req, res) => {

    console.error(req.body, 'This is the error');
    res.sendStatus(200)
})



export default router;



// app.post('/send-email', async (req, res) => {
//     const { candidateEmail } = req.body;



//     try {
//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Failed to send email');
//     }
// });

