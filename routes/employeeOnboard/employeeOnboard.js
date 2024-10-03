import express from 'express';
import conn from '../../sql.js';
import nodemailer from 'nodemailer'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Mapla email odiruchu da ')
//     } catch (error) {
//         console.error('Something went wrong mapla', error)
//         res.send(500).send('Failed to sent email ')
//     }


// })


router.get('/shift', (req, res) => {

    const query = 'SELECT * FROM `shift_master`WHERE status = 1;'

    conn.query(query, (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = ' Something went wrong in the getting shifts ' + err;
            res.send(response)
        } else {
            response.status = 1;
            response.message = 'Data fetched Successfully...';
            response.data = rows;
            res.send(response);
        }
    })

})


router.get('/grade', (req, res) => {

    const query = 'SELECT * FROM `grade_master`WHERE status = 1;'

    conn.query(query, (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = ' Something went wrong in the getting shifts ' + err;
            res.send(response)
        } else {
            response.status = 1;
            response.message = 'Data fetched Successfully...';
            response.data = rows;
            res.send(response);
        }
    })

})



const uploadAddresdoc = (req, res, next) => {

    const id = 3000;

    const file = req.file;

    let response = { status: 0, data: {}, message: '' };

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    console.log(__filename)
    console.log(__dirname)

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2);

    const baseDirectory = path.join(__dirname, 'AddreeProfUploads');
    const yearFoleder = path.join(baseDirectory, currentYear);
    const monthFolder = path.join(yearFoleder, currentMonth);

    if (!file) {
        response.message = "Somethin went wrong in the file " + err;
        res.send(response);
    } else {
        fs.access(baseDirectory, fs.constants.F_OK, (baseErr) => {
            if (baseErr) {
                fs.mkdir(baseDirectory, { recursive: true }, (err) => {
                    if (err) {
                        response.message = "Failed in creating the baseDirectory" + err;
                        res.send(response)
                    }
                })
            }
            fs.access(yearFoleder, fs.constants.F_OK, (yearErr) => {
                if (yearErr) {
                    fs.mkdir(yearFoleder, { recursive: true }, (err) => {
                        if (err) {
                            response.message = " Failed to create the Yearfolder" + err;
                            res.send(response);
                        }
                    })
                }
                fs.access(monthFolder, fs.constants.F_OK, (monthErr) => {
                    if (monthErr) {
                        fs.mkdir(monthFolder, { recursive: true }, (err) => {
                            if (err) {
                                response.message = "Failed to create the MonthFolder" + err;
                                res.send(response);
                            } else {

                                const targetPath = path.join(monthFolder, `${id}_${file.originalname}`);

                                const relativePath = path.relative(__dirname, targetPath);

                                fs.writeFile(targetPath, file.buffer, (err) => {

                                    if (err) {

                                        response.message = "Something went wrong !!! " + err;
                                        res.send(response);
                                    } else {
                                        response.message = "File Uploaded Successfully";
                                        response.status = 1;
                                        response.data.url = relativePath;
                                        res.send(response);
                                    }

                                })


                            }
                        })
                    } else {

                        const targetPath = path.join(monthFolder, `${id}_${file.originalname}`);

                        const relativePath = path.relative(__dirname, targetPath);

                        fs.writeFile(targetPath, file.buffer, (err) => {

                            if (err) {

                                response.message = "Something went wrong !!! " + err;
                                res.send(response);
                            } else {
                                response.message = "File Uploaded Successfully";
                                response.status = 1;
                                response.data.url = relativePath;
                                res.send(response);
                            }

                        })


                    }
                })
            })
        })
    }


}


router.post('/addressprof', upload.single('file'), uploadAddresdoc)



router.post('/', (req, res) => {

    const { formData } = req.body;

    console.log(formData)

    const basicInfoQuery = ' INSERT INTO `employee_onboard` (`emp_id`, `first_name`, `last_name`, `dateofbirth`,' +
        '`employee_number`, `gender`, `email`, `mobile_number`, `phone`, `blood_group`, `date_of_join`, `father_name`, `father_occupation`,' +
        '`country_of_origin`, `nationality`, `emergency_contact_name`, `emergency_contact_number`, `emergency_contact_relation`, `spouse_name`,' +
        ' `physically_challenged`, `education`, `address_prof_type`) VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'


    // let data = [formData.firstname, formData.lastname, formData.dateOfBirth, formData.employeeNumber, formData.gender, formData.email]
    // data = [...data, formData.mobileNumber, formData.phone, formData.bloodGroup, formData.dateOfJoining, formData.fathersName, formData.fathersOccupation, formData.countryOfOrigin]
    // data = [...data, formData.nationality, formData.emergencyContactName, formData.emergencyContactNumber, formData.emergencyContactRelation]
    // data = [...data, formData.spouseName, formData.physicallyChallenged, formData.education, formData.addressprofType]




    const employeePositionQuery = 'UPDATE `employee_onboard` SET `reporting_manager`=?, `reporting_team_lead`=?, `designation`=?, `department`=?,' +
        '`team`=?, `referred_by`=?, `employment_status`=?, `employee_status`=?, `shift`=?,`grade`=?, `probabtion_period`=?, `salary_offered`=?,' +
        '`total_month_salary`=?, `total_yearly_salary`=?,`attendance_bonus`=?, `billable_status`=?, `addres_prof_path`=?'


    // let data = [formData.reportingmanager, formData.reportingteamlead, formData.designation, formData.department, formData.team, formData.referrdby,]
    // data = [...data, formData.employmentstatus, formData.employeestatus, formData.shift, formData.grade, formData.probabationperiod, formData.salaryofferred,]
    // data = [...data, formData.totalmonthlyctc, formData.totalyearlyctc, formData.attendancebonus, formData.billablestatus, formData.addresprofpath,]



    const addressQuery = 'UPDATE `employee_onboard` SET `current_address`=?, `current_city`=?, `current_pincode`=?, `permanent_address`=?, `permanent_city`=?, `permanent_pincode`=?'

    // let data = [formData.currentaddress, formData.currentCity, formData.currentPincode, formData.permanentAddress, formData.permanentcity, formData.permanentPincode]



    const expericenceQuery = 'UPDATE `employee_onboard` SET  `organization_1`=?, `designation_1`=?, `start_date_1`=?, `end_date_1`=?, `totalExperience_1`=?,' +
        '`organization_2`=?, `designation_2`=?, `start_date_2`=?, `end_date_2`=?, `totalExperience_2`=?,' +
        '`organization_3`=?, `designation_3`=?, `start_date_3`=?, `end_date_3`=?, `totalExperience_3`=? '

    // let data = [formData.organization1, formData.designation1, formData.startdate1, formData.enddate1, formData.totalExperience1,]
    // data = [...data, formData.organization2, formData.designation2, formData.startdate2, formData.enddate2, formData.totalExperience2,]
    // data = [...data, formData.organization3, formData.designation3, formData.startdate3, formData.enddate3, formData.totalExperience3]


    const staturyQuery = 'UPDATE  `employee_onboard` SET `aadhaar_number`=?, `pan_number`=?, `passport_number`=?, `uan_number`=?, `pf_number`=?, `pfjoin_date`=?, `esi_number`=?, `lwf_number`=? '

    // let data = [formData.aadhaarnumber, formData.pannumber, formData.passportnumber, formData.uannumber, formData.pfnumber, formData.pfjoindate, formData.esinumber, formData.lwfnumber]


    // `mode_of_payment`, `bank_name`, `branch_name`, `ifsc_code`, `account_number`, `beneficiary_code`

    // modeofpayment: null,
    // bankname: null,
    // branchname: null,
    // ifsccode: null,
    // accountNumber: null,
    // beneficiarycode: null,


    // let data = [formData.modeofpayment, formData.bankname, formData.branchname, formData.ifsccode, formData.accountNumber, formData.beneficiarycode]

    const paymentQuery = 'UPDATE `employee_onboard` SET `mode_of_payment`=?, `bank_name`=?, `branch_name`=?, `ifsc_code`=?, `account_number`=?, `beneficiary_code`=? ';



    // conn.query(staturyQuery, data, (err, rows) => {
    //     if (err) {
    //         console.log(err)
    //         res.send('Something went wrong mapla , you have to face the consquences right .... ')
    //     } else {
    //         console.log('Success dude ehhhhhhhhhhh..................................')
    //         res.send('Ok mapla , you are going good da , check the phpmyamin , post agi iruka illaya nu paru....')
    //     }
    // })

    res.send('Ok mapla , you are going good da , check the phpmyamin , post agi iruka illaya nu paru....')

})



export default router;



// formData.reportingmanager , formData.reportingteamlead , formData.designation , formData.department , formData.team , formData.referrdby , 
// formData.employmentstatus , formData.employeestatus , formData.shift , formData.grade , formData.probabationperiod , formData.salaryofferred ,
// formData.totalmonthlyctc , formData.attendancebonus , formData.totalyearlyctc , formData.billablestatus , formData.addresprofpath ,


// `reporting_manager`, `reporting_team_lead`, `designation`, `department`, `team`, `referred_by`, `employment_status`, `employee_status`, `shift`,
// `grade`, `probabtion_period`, `salary_offered`, `total_month_salary`, `total_yearly_salary`, `attendance_bonus`, `billable_status`, `addres_prof_path`