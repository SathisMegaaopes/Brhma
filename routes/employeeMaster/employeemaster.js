import express from 'express'
import conn from '../../sql.js';

const router = express.Router();

router.get('/', (req, res) => {

    // const sqlQuery = "SELECT * FROM `user_login`";

    const allDepartmentQuery = ' SELECT * FROM `dept_master` WHERE `status` = 1 ';

    const allTeamQuery = 'SELECT * FROM `team_master` WHERE `status` = 1 ';

    let sqlQuery;
    let data;

    const { department, team, employeeName } = req.query;

    console.log(req.query)



    // const department = null;
    // const team = null;
    // const employeeName = 'sathi%';
    const employeeName2 = `${employeeName}%`;

    if (department) {
        sqlQuery = 'SELECT c.first_name , c.last_name , c.employee_number , c.email , c.mobile_number , c.date_of_join , d.user_name , d.user_pwd , d.user_role FROM `employee_onboard` c INNER JOIN  `user_login` d ON d.user_name = c.employee_number WHERE c.department = ? AND c.status = 1;'
    } else if (team) {
        sqlQuery = 'SELECT c.first_name , c.last_name , c.employee_number , c.email , c.mobile_number , c.date_of_join , d.user_name , d.user_pwd , d.user_role FROM `employee_onboard` c INNER JOIN  `user_login` d ON d.user_name = c.employee_number WHERE c.team = ? AND c.status = 1;'
    } else if (employeeName) {
        sqlQuery = 'SELECT c.first_name , c.last_name , c.employee_number , c.email , c.mobile_number , c.date_of_join , d.user_name , d.user_pwd , d.user_role FROM `employee_onboard` c INNER JOIN  `user_login` d ON d.user_name = c.employee_number WHERE c.first_name LIKE ? AND c.status = 1;'
        data = [employeeName2]
    } else {
        sqlQuery = 'SELECT c.first_name , c.last_name , c.employee_number , c.email , c.mobile_number , c.date_of_join , d.user_name , d.user_pwd , d.user_role FROM `employee_onboard` c INNER JOIN  `user_login` d ON d.user_name = c.employee_number WHERE c.status = 1;'
    }


    // console.log(sqlQuery)


    conn.query(allDepartmentQuery, (err, departmentRows) => {

        if (err) {

            response.message = 'Something wrong in getting the department data ... ' + err;
            res.send(response)

        } else {

            conn.query(allTeamQuery, (err, teamRows) => {

                if (err) {

                    response.message = 'Something went wrong in getting the Team data ...' + err;
                    res.send(response);

                } else {


                    if (department) {

                        const { id: departid } = Object.entries(departmentRows).find(([key, value]) => value.name === department)?.[1];

                        data = departid;

                        conn.query(sqlQuery, data, (err, rows) => {

                            // console.log(sqlQuery)
                            // console.log(data)

                            let response = { status: 0, data: {}, message: '' };

                            if (err) {
                                response.message = "Something went wrong ! " + err;
                                res.send(response)
                            } else {

                                if (rows.length === 0) {
                                    response.message = "There is no data found in the database " + err;
                                    res.send(response)
                                } else {
                                    response.message = "Employee Master getted successfully ... "
                                    response.status = 1;
                                    response.data = rows;
                                    res.send(response)
                                }
                            }

                        })

                    } else if (team) {

                        const { id: teamid } = Object.entries(teamRows).find(([key, value]) => value.name === team)?.[1];

                        data = teamid;

                        conn.query(sqlQuery, data, (err, rows) => {
                            let response = { status: 0, data: {}, message: '' };

                            if (err) {
                                response.message = "Something went wrong ! " + err;
                                res.send(response)
                            } else {

                                if (rows.length === 0) {
                                    response.message = "There is no data found in the database " + err;
                                    res.send(response)
                                } else {
                                    response.message = "Employee Master getted successfully ... "
                                    response.status = 1;
                                    response.data = rows;
                                    res.send(response)
                                }
                            }

                        })

                    } else {
                        conn.query(sqlQuery, data, (err, rows) => {
                            let response = { status: 0, data: {}, message: '' };

                            if (err) {
                                response.message = "Something went wrong ! " + err;
                                res.send(response)
                            } else {

                                if (rows.length === 0) {
                                    response.message = "There is no data found in the database " + err;
                                    res.send(response)
                                } else {
                                    response.message = "Employee Master getted successfully ... "
                                    response.status = 1;
                                    response.data = rows;
                                    res.send(response)
                                }
                            }

                        })

                    }

                }
            })

        }

    })



})


router.put('/', (req, res) => {


    const { id, username, password, userrole } = req.body;

    const sqlQuery = " UPDATE `user_login` SET `user_name`= ? , `user_pwd`= ?  WHERE `id` = ? "

    conn.query(sqlQuery, [username, password, id], (err, rows) => {
        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = "Something went wrong in Updating the password " + err;
            res.send(response)
        } else {
            response.message = "Password updated Successfully ! ";
            response.status = 1;
            res.send(response)
        }

    })
})


router.post('/', (req, res) => {

    const { id, username, password, userrole, empid } = req.body;

    const sqlQuery = " INSERT INTO `user_login` (emp_id,user_name, user_pwd,user_role) VALUES (?,?,?,?)"

    conn.query(sqlQuery, [empid, username, password, userrole], (err, rows) => {
        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = "Something went wrong in creating a user " + err;
            res.send(response)
        } else {
            response.message = "User Created Successfully ! ";
            response.status = 1;
            res.send(response)
        }

    })
})




export default router;