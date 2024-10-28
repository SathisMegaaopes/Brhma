import express from 'express';
import conn from '../../sql.js';

const router = express.Router();


router.get('/', (req, res) => {

    // console.log(req.query)
    const { searchData } = req.query;

    let sql_query;
    let data;

    if (searchData) {

        data = `%${searchData}%`
        sql_query = "SELECT * FROM `dept_master` WHERE `status` = 1 AND `name` LIKE ? "

    } else {

        sql_query = "SELECT * FROM `dept_master` WHERE `status` = 1 ";
    }


    conn.query(sql_query,[data], (err, deptRows) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {
            response.message = "Cannot able get the Departmet data" + err;
            res.send(response)
        } else {

            // console.log('Ulla vandhuruchu da babuuuu')

            response.message = " Department data fetched Successfully...";
            response.status = 1;
            response.data = deptRows;

            res.send(response)

        }
    })

})


export default router;