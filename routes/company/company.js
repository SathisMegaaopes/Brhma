import express from 'express';
import conn from '../../sql.js';

const router = express.Router();

router.get('/', (req, res) => {

    const company_Query = "SELECT * FROM `company_master` WHERE `status` = 1";

    conn.query(company_Query, (err, companyRoads) => {

        let response = { status: 0, data: {}, message: '' };

        if (err) {

            response.message = "Something went wrong in getting the company Details " + err;
            res.send(response);

        } else {

            response.message = "Successfully Fetched Details..";
            response.status = 1,
            response.data = companyRoads;
            res.send(response)

        }

    })



})


export default router;