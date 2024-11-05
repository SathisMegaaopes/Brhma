import express from 'express';
import conn from '../../sql.js';

const router = express.Router();


router.get('/', (req, res) => {

    const { searchData } = req.query;

    let sql_query;
    let data;

    if (searchData) {

        data = `%${searchData}%`
        sql_query = "SELECT * FROM `dept_master` WHERE `status` = 1 AND `name` LIKE ? "

    } else {

        sql_query = "SELECT * FROM `dept_master` WHERE `status` = 1 ";
    }

    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';

    conn.query(employeeQuery, (err, employeeRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong in getting the employee details " + err;
            res.send(response);

        } else {

            conn.query(sql_query, [data], (err, deptRows) => {

                if (err) {
                    response.message = "Cannot able get the Departmet data" + err;
                    res.send(response)
                } else {

                    function gettingId(id) {
                        const gettingEmployeeID = Object.entries(employeeRows).find(([key, value]) => value.emp_id === Number(id))?.[1];
                        return `${gettingEmployeeID.f_name} ${gettingEmployeeID.l_name}`
                    }

                    const data = deptRows.map((Deptvalue, index) => {
                        return {
                            id: Deptvalue?.id,
                            name: Deptvalue?.name,
                            parent_department: Deptvalue?.parent_department,
                            lead_name: gettingId(Deptvalue.lead_name),
                            description: Deptvalue?.description,
                            status: Deptvalue.status
                        }
                    })

                    response.message = " Department data fetched Successfully...";
                    response.status = 1;
                    response.data = data;

                    res.send(response)

                }
            })


        }

    })


})


router.get('/:id', (req, res) => {

    const { id } = req.params;

    const sql_query = "SELECT * FROM `dept_master` WHERE `id` = ? AND `status` = 1  "

    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';

    conn.query(employeeQuery, (err, employeeRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong in getting the employee details " + err;
            res.send(response);

        } else {

            conn.query(sql_query, id, (err, deptRows) => {

                if (err) {
                    response.message = "Cannot able get the Departmet data" + err;
                    res.send(response)
                } else {

                    function gettingId(id) {
                        const gettingEmployeeID = Object.entries(employeeRows).find(([key, value]) => value.emp_id === Number(id))?.[1];
                        return `${gettingEmployeeID.f_name} ${gettingEmployeeID.l_name}`
                    }

                    const data = deptRows.map((Deptvalue, index) => {
                        return {
                            name: Deptvalue?.name,
                            parent_department: Deptvalue?.parent_department,
                            lead_name: gettingId(Deptvalue.lead_name),
                            description: Deptvalue?.description,
                            status: Deptvalue.status
                        }
                    })

                    response.message = " Department data fetched Successfully...";
                    response.status = 1;
                    response.data = data;

                    res.send(response)

                }
            })


        }

    })

})


router.post('/', (req, res) => {

    const { departmentName, parentDepartment, leadeName, mode, editmodeID, description } = req.body;


    let sql_add_query;

    if (mode === 1) {

        sql_add_query = " UPDATE `dept_master` SET `name` = ?, `parent_department` = ? , `lead_name` = ? ,`description` = ? WHERE `id` = ? ";

    } else if (mode === 0) {

        sql_add_query = 'INSERT INTO `dept_master` (`id`, `name`, `parent_department`, `lead_name`,`description`, `status`) VALUES (NULL, ?, ?, ?, ?, 1);';
    }


    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';


    conn.query(employeeQuery, (err, employeeRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = " Something went wrong in Getting the Employee Details ... " + err;
            res.send(response)

        } else {

            const gettingEmployeeID = Object.entries(employeeRows).find(([key, value]) => `${value?.f_name} ${value?.l_name}` === leadeName)?.[1];


            const employeeId = gettingEmployeeID?.emp_id;

            conn.query(sql_add_query, mode === 1 ? [departmentName, parentDepartment, employeeId, description, editmodeID] : [departmentName, parentDepartment, employeeId, description], (err, insertRows) => {

                if (err) {

                    response.message = " Something went wrong in Inserting the department ... " + err;
                    res.send(response)

                } else {

                    response.status = 1;
                    response.message = "Department inserted successfully..."
                    res.send(response)

                }
            })

        }

    })



})


export default router;