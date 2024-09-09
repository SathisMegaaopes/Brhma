import express from "express";


import conn from "../../sql.js";
import { generateEmployeeObject } from "../Utlis/index.js";

const router = express.Router();

router.get('/',(req,res)=>{

    let sql_query = "SELECT * FROM emp_master ORDER BY emp_id ASC";

    conn.query(sql_query,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            const changedOne = generateEmployeeObject(rows);
            response.data = changedOne;
            response.message = "success";
            res.send(response);
        }
        else{
            response.status=1;
            response.message = "something went wrong! "+JSON.stringify(err);
            res.send(response);
        }   
    });
    
});


export default router;