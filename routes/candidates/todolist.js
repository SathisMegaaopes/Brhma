import express from "express";
import conn from "../../sql.js";

const router = express.Router();


router.get('/',(req,res)=>{

    const sql_query =  "SELECT * FROM `to_do_list` WHERE 1;"

    conn.query(sql_query,
        (err,rows)=>{
            let response = {status : 0 , data:{ todolist:'' }, message :'' }
            if(!err){
                const todolist = rows;
                response.data.todolist = todolist;
                response.status = 1;
                response.message = 'Todo list fetched from the database';
                res.send(response);
            }else{
                
                response.message = 'Something went Wrong'  + JSON.stringify(err);
                res.send(response);

            }

        }
    )

    // res.send('You are currently on the todolist api , its is working correctly no issues sathis kumar , be happy')
})



export default router;