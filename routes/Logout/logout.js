import express from 'express'
import conn from "../../sql.js";
import { getTodayDate } from '../Utlis/index.js';

const router = express.Router()

router.put('/',(req,res)=>{

    const date = getTodayDate()

    const { data } = req.body

    const query = " UPDATE `emp_activity` SET `logout_time` = CURRENT_TIMESTAMP WHERE `emp_id`= ?  AND `login_time` LIKE  ? "

    conn.query(query,[data,date],(err,row)=>{
        let response = { status: 0, data: [], message: "" };
        if(!err){
            response.message = " You are logged out successfully .... "
            response.status = 1
            res.send(response)
        }else{

            response.message = "Something went wrong ! .... " + err
            res.send(response)

        }
    })


})


export default router