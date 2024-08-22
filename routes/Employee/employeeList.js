import express from "express";


import conn from "../../sql.js";

const router = express.Router();

router.get('/',(req,res)=>{

    let sql_query = "SELECT * FROM employee_master ORDER BY emp_id ASC";

    conn.query(sql_query,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            response.data = rows;
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