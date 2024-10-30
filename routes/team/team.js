import express from 'express'
import conn from '../../sql.js';

const router = express.Router();


router.get('/', (req, res) => {

    const { searchData } = req.query;

    let team_query;
    let data;

    if (searchData) {

        data = `%${searchData}%`
        team_query = "SELECT * FROM `team_master` WHERE `status` = 1 AND `name` LIKE ? "

    } else {

        team_query = "SELECT * FROM `team_master` WHERE `status` = 1 ";
    }


    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';

    const department_query = "SELECT * FROM `dept_master` WHERE `status` = 1"

    conn.query(employeeQuery, (err, employeeData) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong getting the Employee Details .... " + err;
            res.send(response);

        } else {

            conn.query(department_query, (err, departmentRows) => {

                if (err) {

                    response.message = "Something went wrong in getting the Department Details ..... " + err;
                    res.send(response);

                } else {

                    conn.query(team_query, data, (err, teamRows) => {

                        if (err) {

                            response.message = "Something went wrong in getting the Team Details..... " + err;
                            res.send(response)

                        } else {


                            function gettingNameWithId(id) {

                                const gettingEmployeeID = Object.entries(employeeData).find(([key, value]) => value.emp_id === Number(id))?.[1];
                                return `${gettingEmployeeID.f_name} ${gettingEmployeeID.l_name}`

                            }

                            function gettingDepartnameWithId(id) {

                                const gettingName = Object.entries(departmentRows).find(([key, value]) => value.id === Number(id))?.[1];
                                // const gettingName = Object.entries(departmentRows).find(([key, value]) => value.id === 1)?.[1];
                                // console.log(gettingName, 'This is the getting names')
                                return gettingName?.name;
                            }

                            const responseData = teamRows.map((value, index) => {

                                return {
                                    id: value?.id,
                                    department: gettingDepartnameWithId(value?.dept_id),
                                    name: value?.name,
                                    manager: gettingNameWithId(value?.manager),
                                    teamLead: gettingNameWithId(value?.team_lead),
                                    description: value?.description,
                                    status: value?.status
                                }

                            })

                            // res.send(employeeData,teamRows)
                            response.status = 1;
                            response.message = "Teams data getted Successfully.......";
                            response.data = responseData;

                            res.send(response);

                        }
                    })

                }
            })



        }

    })


})



router.post('/', (req, res) => {

    console.log(req.body)

    res.send('super dude')

})


export default router;