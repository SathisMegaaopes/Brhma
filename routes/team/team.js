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

    const { id } = req.params;

    let team_query;
    let data = [id]

    team_query = "SELECT * FROM `team_master` WHERE `id` = ? AND `status` = 1  "

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


                            const get_employee_team_based_Query = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `team`= ? AND `status` = 1';

                            conn.query(get_employee_team_based_Query, id, (err, EmployeeTeamRows) => {

                                if (err) {

                                    response.message = "Something went wrong in getting the Employees based on Team Details..... " + err;
                                    res.send(response)

                                } else {

                                    const FinalValues = EmployeeTeamRows.map((item) => {

                                        return {
                                            "label": `${item?.f_name} ${item?.l_name}`,
                                            "value": `${item?.f_name} ${item?.l_name}`,
                                        }
                                    })

                                    const responseData = teamRows.map((value, index) => {

                                        return {
                                            id: value?.id,
                                            department: gettingDepartnameWithId(value?.dept_id),
                                            name: value?.name,
                                            manager: gettingNameWithId(value?.manager),
                                            teamLead: gettingNameWithId(value?.team_lead),
                                            members: FinalValues,
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

        }

    })
})


router.post('/', (req, res) => {

    const { teamName, department, manager, teamLead, members, teamDescription, mode, editmodeID } = req.body;

    let sql_add_query;

    if (mode === 1) {

        sql_add_query = "UPDATE `team_master` SET `dept_id` = ?, `name` = ?, `manager` = ?, `team_lead` = ?, `description` = ? WHERE `id` = ? ";

    } else if (mode === 0) {

        sql_add_query = 'INSERT INTO `team_master` (`id`, `dept_id`, `name`, `manager`, `team_lead`, `description`, `status`) VALUES (NULL, ?, ?, ?, ?, ? ,1);';
    }


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

                    const allMembers = members.map((item) => {

                        const name = gettingIdwithName(item?.value);

                        return name;

                    })


                    if (allMembers.length > 0) {

                        conn.query(sql_add_query, mode === 1 ? [finalDepartmentID, teamName, managerID, teamLeadID, teamDescription, editmodeID] : [finalDepartmentID, teamName, managerID, teamLeadID, teamDescription], (err, rows) => {

                            if (err) {

                                response.message = " Something went wrong in Updating the Team Details ... " + err;
                                res.send(response)

                            } else {

                                const total_Team_Available_Query = "SELECT * FROM `team_master` WHERE `status` = 1";

                                conn.query(total_Team_Available_Query, (err, totalTeamsRows) => {

                                    if (err) {

                                        response.message = " Something went wrong in Getting the Total Team Details ... " + err;
                                        res.send(response)

                                    } else {



                                        const gettingTeamDetails = Object.entries(totalTeamsRows).find(([key, value]) => value.name === teamName)?.[1];

                                        const teamId = gettingTeamDetails?.id;
                                        const departmentId = gettingTeamDetails?.dept_id;


                                        const totalPastMembers = " SELECT `emp_id` FROM `emp_master` WHERE `team` = ? AND `status` = 1 "

                                        conn.query(totalPastMembers, teamId, (err, totalPastMembersRows) => {
                                            if (err) {
                                                response.message = "Something went wrong in Getting the Details of Past Team Members: " + err;
                                                return res.send(response);
                                            }

                                            const totalPastMembersIds = totalPastMembersRows.map((item) => item?.emp_id);

                                            const missingNumbers = totalPastMembersIds.filter(num => !allMembers.includes(num));
                                            let updateCount = 0;
                                            const totalUpdates = missingNumbers.length + allMembers.length;

                                            const checkAndSendResponse = () => {
                                                updateCount++;
                                                if (updateCount === totalUpdates) {
                                                    response.status = 1;
                                                    response.message = "Successfully updated the Team List.";
                                                    res.send(response);
                                                }
                                            };

                                            for (let i = 0; i < missingNumbers.length; i++) {
                                                const update_Employees_Query = "UPDATE `emp_master` SET `department` = NULL, `team` = NULL WHERE `emp_id` = ? AND `status` = 1";
                                                let data = [missingNumbers[i]];

                                                conn.query(update_Employees_Query, data, (err, updatedRows) => {
                                                    if (err) {
                                                        response.message = "Something went wrong in updating the Employee Master data: " + err;
                                                        return res.send(response);
                                                    }
                                                    checkAndSendResponse();
                                                });
                                            }

                                            for (let i = 0; i < allMembers.length; i++) {
                                                const update_Employees_Query = "UPDATE `emp_master` SET `department` = ?, `team` = ? WHERE `emp_id` = ? AND `status` = 1";
                                                let data = [departmentId, teamId, allMembers[i]];

                                                conn.query(update_Employees_Query, data, (err, updatedRows) => {
                                                    if (err) {
                                                        response.message = "Something went wrong in updating the Employee Master data: " + err;
                                                        return res.send(response);
                                                    }
                                                    checkAndSendResponse();
                                                });
                                            }
                                        });


                                    }
                                })


                            }
                        })


                    } else {

                        response.message = " You have to select the Candidates ... " + err;
                        res.send(response)

                    }

                }
            })


        }
    })

})


export default router;