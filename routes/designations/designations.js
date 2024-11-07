import express from 'express';
import conn from '../../sql.js';

const router = express.Router();


router.get('/', (req, res) => {

    const { searchData } = req.query;

    let sql_query;
    let data;

    if (searchData) {

        data = `%${searchData}%`
        sql_query = "SELECT * FROM `designations_master` WHERE `status` = 1 AND `name` LIKE ? "

    } else {

        sql_query = "SELECT * FROM `designations_master` WHERE `status` = 1";
    }

    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';

    conn.query(employeeQuery, (err, employeeRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong in getting the employee details " + err;
            res.send(response);

        } else {

            conn.query(sql_query, [data], (err, designationsRows) => {

                if (err) {

                    response.message = "Something went wrong in getting the designations data " + err;
                    res.send(response);

                } else {

                    function gettingId(id) {
                        const gettingEmployeeID = Object.entries(employeeRows).find(([key, value]) => value.emp_id === Number(id))?.[1];
                        return `${gettingEmployeeID.f_name} ${gettingEmployeeID.l_name}`
                    }

                    const finalData = designationsRows.map((item) => {
                        return {
                            "id": item?.id,
                            "name": item?.name,
                            "manager": gettingId(item?.manager),
                            "billable": item?.billable,
                            "status": item?.status
                        }
                    })

                    response.message = "Successfully Fetched the data ....";
                    response.status = 1;
                    response.data = finalData

                    res.send(response)

                }
            })

        }

    })


})


router.post('/', (req, res) => {

    const { designationName, leadeName, billable } = req.body;

    let response = { status: 0, data: {}, message: '' };

    const add_designation_query = "INSERT INTO `designations_master` (`id`, `name`, `manager`, `billable`, `status`) VALUES(NULL, ? , ?, ?, '1')";


    const employeeQuery = 'SELECT `emp_id` , `f_name` , `l_name`  FROM `emp_master` WHERE `status` = 1';


    conn.query(employeeQuery, (err, employeeRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = " Something went wrong in Getting the Employee Details ... " + err;
            res.send(response)

        } else {

            const gettingEmployeeID = Object.entries(employeeRows).find(([key, value]) => `${value?.f_name} ${value?.l_name}` === leadeName)?.[1];


            const employeeId = gettingEmployeeID?.emp_id;


            conn.query(add_designation_query, [designationName, employeeId, billable], (err, insertedRows) => {

                if (err) {

                    response.message = " Something went wrong in Inserting the Designation Details ... " + err;
                    res.send(response)

                } else {

                    response.message = "Successfully Added Designation  ....";
                    response.status = 1;

                    res.send(response);

                }

            })

        }

    })


})

export default router;