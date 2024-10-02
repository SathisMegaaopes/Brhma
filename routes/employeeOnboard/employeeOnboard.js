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




// firstname,
// lastname,
// dateOfBirth,
// employeeNumber,
// gender,
// email,
// mobileNumber,
// phone,
// bloodGroup,
// dateOfJoining,
// fathersName,
// fathersOccupation,
// countryOfOrigin,
// nationality,
// emergencyContactName,
// emergencyContactNumber,
// emergencyContactRelation,
// spouseName,
// physicallyChallenged,
// education,
// addressprofType,
// permanentAddress,
// permanentcity,
// permanentPincode,
// totalmonthlyctc,
// totalyearlyctc,
// bankname,
// branchname,
// ifsccode,
// accountNumber,
// beneficiarycode,
// pfnumber,
// pfjoindate


router.post('/', (req, res) => {

    const { formData } = req.body;

    const basicInfoQuery = ' INSERT INTO `employee_onboard` (`emp_id`, `first_name`, `last_name`, `dateofbirth`,' +
        '`employee_number`, `gender`, `email`, `mobile_number`, `phone`, `blood_group`, `date_of_join`, `father_name`, `father_occupation`,' +
        '`country_of_origin`, `nationality`, `emergency_contact_name`, `emergency_contact_number`, `emergency_contact_relation`, `spouse_name`,' +
        ' `physically_challenged`, `education`, `address_prof_type`) VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

    // console.log(basicInfoQuery)

    let data = [formData.firstname, formData.lastname, formData.dateOfBirth, formData.employeeNumber, formData.gender, formData.email]
    data = [...data, formData.mobileNumber, formData.phone, formData.bloodGroup, formData.dateOfJoining, formData.fathersName, formData.fathersOccupation, formData.countryOfOrigin]
    data = [...data, formData.nationality, formData.emergencyContactName, formData.emergencyContactNumber, formData.emergencyContactRelation]
    data = [...data, formData.spouseName, formData.physicallyChallenged, formData.education, formData.addressprofType]


    conn.query(basicInfoQuery, data, (err, rows) => {
        if (err) {
            console.log(err)
            res.send('Something went wrong mapla , you have to face the consquences right .... ')
        } else {
            console.log('Success dude ehhhhhhhhhhh..................................')
            res.send('Ok mapla , you are going good da , check the phpmyamin , post agi iruka illaya nu paru....')
        }
    })


    // formData.firstname, formData.lastname, formData.dateOfBirth, formData.employeeNumber, formData.gender, formData.email
    // formData.mobileNumber, formData.phone, formData.bloodGroup, formData.dateOfJoining, formData.fathersName, formData.fathersOccupation, formData.countryOfOrigin
    // formData.nationality, formData.emergencyContactName, formData.emergencyContactNumber, formData.emergencyContactRelation,
    //     formData.spouseName, formData.physicallyChallenged, formData.education, formData.addressprofType

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

