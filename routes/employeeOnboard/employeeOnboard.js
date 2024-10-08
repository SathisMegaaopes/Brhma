import express from 'express';
import conn from '../../sql.js';
import nodemailer from 'nodemailer'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DateFormater } from '../Utlis/index.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const transporter = nodemailer.createTransport({
    host: "brhma.org.in",
    port: "465",
    secure: true,
    auth: {
        user: "no-reply@brhma.org.in",
        pass: "Megaoopes@brhma"
    }
});





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


router.get('/addressprof', (req, res) => {

    const query = 'SELECT * FROM `addressprof_master` WHERE status = 1;'

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


router.get('/designations', (req, res) => {

    const query = 'SELECT DISTINCT `designation` FROM `emp_master` WHERE `status`=1'

    conn.query(query, (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = ' Something went wrong in the getting shifts ' + err;
            res.send(response)
        } else {

            const mappedValue = rows.map((item) => {
                return {
                    name: item.designation
                }
            })

            response.status = 1;
            response.message = 'Data fetched Successfully...';
            response.data = mappedValue;
            res.send(response);
        }
    })

})


router.get('/getCandidate', (req, res) => {


    const { id } = req.query;

    const query1 = 'SELECT * FROM `candidate_master` WHERE `candidate_id` = ? ;'

    const query2 = 'SELECT * FROM `candidate_edu_master` WHERE `candidate_id` = ? '

    const query3 = 'SELECT * FROM `candidate_personal` WHERE `candidate_id` = ?'

    const query4 = 'SELECT * FROM `candidate_work` WHERE `candidate_id` = ?'

    conn.query(query1, [id], (err, rows1) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = ' Something went wrong in the getting shifts ' + err;
            res.send(response);
        } else {

            const foriegnKeyId = rows1[0].id

            conn.query(query2, [foriegnKeyId], (err, rows2) => {
                if (err) {
                    response.message = 'Something went wrong at getting education of the candidate ' + err;
                    res.send(response);
                } else {

                    conn.query(query3, [foriegnKeyId], (err, rows3) => {
                        if (err) {
                            response.message = 'Something went wrong in getting the personal details of the candidate' + err;
                            res.send(response);
                        } else {

                            conn.query(query4, [foriegnKeyId], (err, rows4) => {

                                if (err) {
                                    response.message = 'Something went wrong in gettig the work details of the candiate...' + err;
                                    res.send(response);
                                } else {


                                    const DateFormater2 = (val) => {
                                        let [day, month, year] = val.split('/');

                                        day = ("0" + day).slice(-2);
                                        month = ("0" + month).slice(-2);

                                        return `${year}-${month}-${day}`;
                                    };

                                    const mappedValue = rows1.map((item, index) => {
                                        return {
                                            firstname: item?.f_name_basic,
                                            lastname: item?.l_name_basic,
                                            dateOfBirth: DateFormater2(item?.dob),
                                            gender: item?.gender,
                                            email: item?.email_basic,
                                            mobileNumber: item?.mobile_basic,

                                            fathersName: rows3[index]?.father_name,
                                            fathersOccupation: rows3[index]?.father_occupation,

                                            organization1: rows4[index]?.company_1,
                                            designation1: rows4[index]?.designation_1,
                                            organization2: rows4[index]?.company_2,
                                            designation2: rows4[index]?.designation_2,
                                            organization3: rows4[index]?.company_3,
                                            designation3: rows4[index]?.designation_3,
                                            profileUrl: item.profile
                                        }
                                    })


                                    response.status = 1;
                                    response.message = 'Data fetched Successfully...';
                                    response.data = mappedValue;
                                    res.send(response);



                                }

                            })

                        }
                    })
                }
            })

        }
    })

})

router.get('/onboardedIDs', (req, res) => {

    const gettingIdsQuery = 'SELECT `emp_id` FROM `employee_onboard` WHERE `status` = 1';

    conn.query(gettingIdsQuery, (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong in the gettings ids in the onboard : " + err;
            res.send(response);

        } else {

            const mappedIDs = rows.map((item) => item.emp_id);

            response.message = "SuccessFully fetched the data ... ";
            response.status = 1;
            response.data = mappedIDs;
            res.send(response);
        }

    })

})

router.get('/getEmployee', (req, res) => {

    const { employee_id } = req.query;

    const getEmployeeQuery = ' SELECT * FROM `employee_onboard` WHERE `employee_number` = ? AND `status` = 1 ';

    conn.query(getEmployeeQuery, [employee_id], (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = "Something went wrong in getting the employee Details " + err;
            res.send(response);
        } else {

            if (rows.length > 0) {
                const item = rows[0];

                const PopulatedData = {
                    firstname: item.first_name,
                    lastname: item.last_name,
                    dateOfBirth: DateFormater(item.dateofbirth),
                    employeeNumber: item.employee_number,
                    gender: item.gender,
                    email: item.email,
                    mobileNumber: item.mobile_number,
                    phone: item.phone,
                    bloodGroup: item.blood_group,
                    dateOfJoining: DateFormater(item.date_of_join),
                    fathersName: item.father_name,
                    fathersOccupation: item.father_occupation,
                    countryOfOrigin: item.country_of_origin,
                    nationality: item.nationality,
                    emergencyContactName: item.emergency_contact_name,
                    emergencyContactNumber: item.emergency_contact_number,
                    emergencyContactRelation: item.emergency_contact_relation,
                    spouseName: item.spouse_name,
                    physicallyChallenged: item.physically_challenged,
                    education: item.education,
                    addressprofType: item.address_prof_type,
                    reportingmanager: item.reporting_manager,
                    reportingteamlead: item.reporting_team_lead,
                    designation: item.designation,
                    department: item.department,
                    team: item.team,
                    referrdby: item.referred_by,
                    employmentstatus: item.employment_status,
                    employeestatus: item.employee_status,
                    shift: item.shift,
                    grade: item.grade,
                    probabationperiod: item.probabtion_period,
                    salaryofferred: item.salary_offered,
                    totalmonthlyctc: item.total_month_salary,
                    attendancebonus: item.attendance_bonus,
                    totalyearlyctc: item.total_yearly_salary,
                    billablestatus: item.billable_status,
                    addresprofpath: item.addres_prof_path,
                    currentaddress: item.current_address,
                    permanentAddress: item.permanent_address,
                    currentCity: item.current_city,
                    currentPincode: item.current_pincode,
                    permanentcity: item.permanent_city,
                    permanentPincode: item.permanent_pincode,
                    organization1: item.organization_1,
                    designation1: item.designation_1,
                    startdate1: DateFormater(item.start_date_1),
                    enddate1: DateFormater(item.end_date_1),
                    totalExperience1: item.totalExperience_1,
                    organization2: item.organization_2,
                    designation2: item.designation_2,
                    startdate2: DateFormater(item.start_date_2),
                    enddate2: DateFormater(item.end_date_2),
                    totalExperience2: item.totalExperience_2,
                    organization3: item.organization_3,
                    designation3: item.designation_3,
                    startdate3: DateFormater(item.start_date_3),
                    enddate3: DateFormater(item.end_date_3),
                    totalExperience3: item.totalExperience_3,
                    aadhaarnumber: item.aadhaar_number,
                    pannumber: item.pan_number,
                    passportnumber: item.passport_number,
                    uannumber: item.uan_number,
                    pfnumber: item.pf_number,
                    pfjoindate: DateFormater(item.pfjoin_date),
                    esinumber: item.esi_number,
                    lwfnumber: item.lwf_number,
                    modeofpayment: item.mode_of_payment,
                    bankname: item.bank_name,
                    branchname: item.branch_name,
                    ifsccode: item.ifsc_code,
                    accountNumber: item.account_number,
                    beneficiarycode: item.beneficiary_code,
                    profileUrl: item.profileUrl

                }

                response.message = "Data fetcched Successfully....";
                response.status = 1;
                response.data = PopulatedData;
                res.send(response);
            }

        }
    })


})



const uploadAddresdoc = (req, res, next) => {   //It is a Controller for Uploading the file to the backend Directory......

    const { id } = req.body;


    const file = req.file;

    let response = { status: 0, data: {}, message: '' };

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

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


const uploadProfile = (req, res, next) => {   //It is a Controller for Uploading the ProfilePhoto. to the backend Directory......

    const id = Math.floor(1000 + Math.random() * 9000);


    const file = req.file;

    let response = { status: 0, data: {}, message: '' };

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2);

    const baseDirectory = path.join(__dirname, 'profileUploads');
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


router.post('/profileUpload', upload.single('file'), uploadProfile)


function generateRandomPassword() {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*_|<>?';

    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

    let password = '';

    password += upperCaseLetters.charAt(Math.floor(Math.random() * upperCaseLetters.length));
    password += lowerCaseLetters.charAt(Math.floor(Math.random() * lowerCaseLetters.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));

    for (let i = 4; i < 8; i++) {
        password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }

    return password.split('').sort(() => 0.5 - Math.random()).join('');
}


router.get('/employeeCheckIds', (req, res) => {

    const gettingIdsQuery = 'SELECT `employee_number` FROM `employee_onboard` WHERE `status` = 1';

    conn.query(gettingIdsQuery, (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong in the gettings ids in the onboard : " + err;
            res.send(response);

        } else {

            const mappedIDs = rows.map((item) => item.employee_number);

            response.message = "SuccessFully fetched the data ... ";
            response.status = 1;
            response.data = mappedIDs;
            res.send(response);
        }

    })

})


router.post('/', (req, res) => {

    const { formData, reqType, requestType, emp_id, referenceid, activeStep, profileUrl, available } = req.body;

    let basicInfoQuery;
    let data;


    if (activeStep === 0) {

        if ((reqType === 1 || reqType === 2) && requestType === 1 && available === 0) {

            basicInfoQuery = ' INSERT INTO `employee_onboard` (`emp_id`, `first_name`, `last_name`, `dateofbirth`,' +
                '`employee_number`, `gender`, `email`, `mobile_number`, `phone`, `blood_group`, `date_of_join`, `father_name`, `father_occupation`,' +
                '`country_of_origin`, `nationality`, `emergency_contact_name`, `emergency_contact_number`, `emergency_contact_relation`, `spouse_name`,' +
                ' `physically_challenged`, `education`, `address_prof_type` , `profileUrl` ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

            data = [referenceid, formData.firstname, formData.lastname, formData.dateOfBirth, formData.employeeNumber, formData.gender, formData.email]
            data = [...data, formData.mobileNumber, formData.phone, formData.bloodGroup, formData.dateOfJoining, formData.fathersName, formData.fathersOccupation, formData.countryOfOrigin]
            data = [...data, formData.nationality, formData.emergencyContactName, formData.emergencyContactNumber, formData.emergencyContactRelation]
            data = [...data, formData.spouseName, formData.physicallyChallenged, formData.education, formData.addressprofType, profileUrl]


        } else {

            basicInfoQuery = ' UPDATE `employee_onboard` SET `first_name` = ?, `last_name` = ?, `dateofbirth` = ?, `employee_number` = ?,' +
                '`gender` = ?, `email` = ?, `mobile_number` = ?, `phone` = ?, `blood_group` = ?, `date_of_join` = ?, `father_name` = ?, `father_occupation` = ?,' +
                '`country_of_origin` = ?, `nationality` = ?, `emergency_contact_name` = ?, `emergency_contact_number` = ?, `emergency_contact_relation` = ?, `spouse_name` = ?,' +
                '`physically_challenged` = ?, `education` = ?, `address_prof_type` = ? WHERE `employee_number` = ?';


            data = [formData.firstname, formData.lastname, formData.dateOfBirth, formData.employeeNumber, formData.gender, formData.email]
            data = [...data, formData.mobileNumber, formData.phone, formData.bloodGroup, formData.dateOfJoining, formData.fathersName, formData.fathersOccupation, formData.countryOfOrigin]
            data = [...data, formData.nationality, formData.emergencyContactName, formData.emergencyContactNumber, formData.emergencyContactRelation]
            data = [...data, formData.spouseName, formData.physicallyChallenged, formData.education, formData.addressprofType, formData.employeeNumber]

        }

    } else if (activeStep === 1) {

        basicInfoQuery = ' UPDATE `employee_onboard` SET `reporting_manager` = ?, `reporting_team_lead` = ?, `designation` = ?, `department` = ?, `team` = ?, `referred_by` = ?, `employment_status` = ?, `employee_status` = ?, `shift` = ?,' +
            ' `grade` = ?, `probabtion_period` = ?, `salary_offered` = ?, `total_month_salary` = ?, `total_yearly_salary` = ?, `attendance_bonus` = ?, `billable_status` = ?, `addres_prof_path` = ? WHERE `employee_number` = ? '


        data = [formData.reportingmanager, formData.reportingteamlead, formData.designation, formData.department, formData.team, formData.referrdby, formData.employmentstatus, formData.employeestatus, formData.shift, formData.grade,]
        data = [...data, formData.probabationperiod, formData.salaryofferred, formData.totalmonthlyctc, formData.totalyearlyctc, formData.attendancebonus, formData.billablestatus, formData.addresprofpath, emp_id]

    } else if (activeStep === 2) {

        basicInfoQuery = ' UPDATE `employee_onboard` SET  `current_address` = ? , `current_city` = ? , `current_pincode` = ?, `permanent_address` = ? ,`permanent_city` = ? , `permanent_pincode` = ? WHERE `employee_number` = ? ';

        data = [formData.currentaddress, formData.currentCity, formData.currentPincode, formData.permanentAddress, formData.permanentcity, formData.permanentPincode, emp_id]

    } else if (activeStep === 3) {


        basicInfoQuery = ' UPDATE `employee_onboard` SET `organization_1` = ?, `designation_1` = ?, `start_date_1` = ? , `end_date_1` = ? , `totalExperience_1` = ?, `organization_2` = ?, `designation_2` = ?, `start_date_2` = ? , `end_date_2` = ? , `totalExperience_2` = ?,' +
            ' `organization_3` = ?, `designation_3` = ?, `start_date_3` = ? , `end_date_3` = ? , `totalExperience_3` = ? WHERE `employee_number` = ? '

        data = [formData.organization1, formData.designation1, formData.startdate1, formData.enddate1, formData.totalExperience1, formData.organization2, formData.designation2,]
        data = [...data, formData.startdate2, formData.enddate2, formData.totalExperience2, formData.organization3, formData.designation3, formData.startdate3, formData.enddate3, formData.totalExperience3, emp_id]

    } else if (activeStep === 4) {
        basicInfoQuery = ' UPDATE `employee_onboard` SET `aadhaar_number` = ? ,`pan_number` = ? ,`passport_number` = ? ,`uan_number` = ? ,`pf_number` = ? ,`pfjoin_date` = ?,`esi_number` = ? ,`lwf_number` = ? WHERE `employee_number` = ? ',

            data = [formData.aadhaarnumber, formData.pannumber, formData.passportnumber, formData.uannumber, formData.pfnumber, formData.pfjoindate, formData.esinumber, formData.lwfnumber, emp_id]

    } else if (activeStep === 5) {

        basicInfoQuery = ' UPDATE `employee_onboard` SET `mode_of_payment` = ? , `bank_name` = ? , `branch_name` = ? , `ifsc_code` = ? , `account_number` = ? , `beneficiary_code` = ? WHERE `employee_number` = ? ',

            data = [formData.modeofpayment, formData.bankname, formData.branchname, formData.ifsccode, formData.accountNumber, formData.beneficiarycode, emp_id]
    }


    conn.query(basicInfoQuery, data, (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = 'Something went wrong in the creating or updating the employee ' + err;
            res.send(response)

        } else {

            const userName = emp_id;

            const password = generateRandomPassword();

            if (activeStep === 5 && (reqType === 1 || reqType === 2)) {

                const loginQuery = 'INSERT INTO `user_login` (`id`, `user_name`, `user_pwd`, `user_role`, `login_time`, `emp_id`) VALUES (NULL, ?, ?, ?, current_timestamp(), ?);'

                conn.query(loginQuery, [userName, password, '2', userName], async (err, rows) => {
                    if (err) {
                        response.message = "Sonething went wrong in creating the logins : " + err;
                        res.send(response);

                    } else {

                        const mailOptions = {
                            from: 'sathiskumar.r@megaaopes.com',
                            to: 'sathiskumar.r@megaaopes.com',
                            subject: 'Welcome to the Team!',
                            html: `<h1>Welcome! Sathis Kumar</h1>
                                   <p>We are excited to have you on board.</p>
                                   <p>This is your username: ${userName}</p>
                                   <p>This is your password: ${password}</p>
                                   <p>Best regards,</p>
                                   <p>MegaaOpes Solutions...</p>`,
                        };

                        try {
                            await transporter.sendMail(mailOptions);
                            response.message = "Success Created Employee and login Credentials....";
                            response.status = 1;
                            res.status(200).send(response);
                        } catch (error) {
                            response.message = 'Failed to send email' + err;
                            res.send(response)

                        }
                    }
                })

            } else {
                response.message = 'Successfully updated...';
                response.status = 1;
                res.send(response);

            }
        }
    })


})

router.get('/dynamicDepartments', (req, res) => {


    const { value } = req.query;

    const fullData = value + '%';

    const query = 'SELECT * FROM `dept_master` WHERE `name` LIKE ? AND `status` = 1 ';


    conn.query(query, [fullData], (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = 'Something went wrong ! ' + err;
            res.send(response);

        } else {

            response.message = 'Successfully fetched the data ...';
            response.status = 1;
            response.data = rows;
            res.send(response);

        }
    })

})


router.get('/dynamicTeams', (req, res) => {

    // const { value } = req.query;

    const value = 's';

    const fullData = value + '%';

    // const query = ' SELECT * FROM `team_master` WHERE `name` LIKE ? AND `status` = 1 ';

    const query = 'SELECT * FROM `team_master` WHERE `name` LIKE ? AND `status` = 1';


    conn.query(query, [fullData], (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = 'Sonething went wrong in getting the Teams data ' + err;
            res.send(response);

        } else {

            response.message = "Successfully fetched the Teams data";
            response.status = 1;
            response.data = rows;
            res.send(rows);

        }
    })

})

export default router;


