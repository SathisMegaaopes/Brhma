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


router.get('/:id', (req, res) => {

    // const { id } = req.params;
    const id = 1;

    let team_query;
    let data = [id]

    team_query = "SELECT * FROM `team_master` WHERE `id` = ? AND `status` = 1  "

    // if (searchData) {

    //     data = `%${searchData}%`
    //     team_query = "SELECT * FROM `team_master` WHERE `status` = 1 AND `name` LIKE ? "

    // } else {

    //     team_query = "SELECT * FROM `team_master` WHERE `status` = 1 ";
    // }


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

// {
//     teamName: 'First demo',
//     department: 'Human Resource',
//     manager: 'Seema ',
//     teamLead: 'Seema ',
//     members: [
//       { label: 'Adarsh B M', value: 'Adarsh B M' },
//       { label: 'Puja Chetry', value: 'Puja Chetry' },
//       { label: 'Shamala Nagaveni S', value: 'Shamala Nagaveni S' },
//       { label: 'Shamala Nagaveni S', value: 'Shamala Nagaveni S' }
//     ],
//     teamDescription: 'askjdgfsad',
//     mode: 0
//   }


router.post('/', (req, res) => {

    //data to be inserted 

    // [teamName , department , manager , teamLead , teamDescription  ]

    // miss agurathu vandhu ======>>>>> members , mode ====>>>>  ok va 

    // "teamName": teamName,
    //         "department": department,
    //         "manager": manager,
    //         "teamLead": teamLead,
    //         "members": members,
    //         "teamDescription": teamDescription,
    //         "mode": mode,


    const { teamName, department, manager, teamLead, members, teamDescription, mode, editmodeID } = req.body;

    /// id illa da update panna , ena nu konjam paru seriya , ne patuku irukatha da dei....

    let sql_add_query;

    if (mode === 1) {

        sql_add_query = "UPDATE `team_master` SET `dept_id` = ?, `name` = ?, `manager` = ?, `team_lead` = ?, `description` = ? WHERE `id` = ? ";

    } else if (mode === 0) {

        sql_add_query = 'INSERT INTO `team_master` (`id`, `dept_id`, `name`, `manager`, `team_lead`, `description`, `status`) VALUES (NULL, ?, ?, ?, ?, ? ,1);';
    }


    console.log(sql_add_query)

    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';

    conn.query(employeeQuery, (err, employeeRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = " Something went wrong in Getting the Employee Details ... " + err;
            res.send(response)

        } else {

            const departmentQuery = " SELECT * FROM `dept_master` WHERE `status` = 1 ";

            conn.query(departmentQuery, (err, departmentRows) => {
                if (err) {

                    response.message = " Something went wrong in Getting the Employee Details ... " + err;
                    res.send(response)

                } else {

                    function gettingIdwithName(name) {

                        const gettingEmployeeID = Object.entries(employeeRows).find(([key, value]) => `${value?.f_name} ${value?.l_name}` === name)?.[1];
                        return gettingEmployeeID?.emp_id;

                    }

                    const gettingDepartmentID = Object.entries(departmentRows).find(([key, value]) => value.name === department)?.[1];

                    const finalDepartmentID = gettingDepartmentID?.id;

                    const managerID = gettingIdwithName(manager);

                    const teamLeadID = gettingIdwithName(teamLead);

                    // `dept_id`, `name`, `manager`, `team_lead `, `description`

                    conn.query(sql_add_query, mode === 1 ? [finalDepartmentID, teamName, managerID, teamLeadID, teamDescription, editmodeID] : [finalDepartmentID, teamName, managerID, teamLeadID, teamDescription ], (err, rows) => {

                        if (err) {

                            response.message = " Something went wrong in Updating the Team Details ... " + err;
                            res.send(response)

                        } else {

                            response.status = 1;
                            response.message = "Successfully added to the Team List ....";
                            res.send(response);

                        }
                    })

                    // const willtrydaDude = members.map((item) => {

                    //     const name = gettingIdwithName(item?.value);

                    //     return name;

                    // })
                    // console.log(willtrydaDude)

                    // res.send(departmentRows)
                }
            })


        }
    })

})


export default router;