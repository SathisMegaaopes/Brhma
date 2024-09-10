import express from 'express'
import conn from '../../sql.js';

const router = express.Router();

router.get('/',(req,res)=>{

    const sqlQuery = "SELECT * FROM `user_login`"

    conn.query(sqlQuery,(err,rows)=>{
        let response = { status: 0, data: { }, message: '' };

        if(err){
            response.message = "Something went wrong ! " + err ;
            res.send(response)
        }else{
            if(rows.length === 0 ){
                response.message = "There is no data found in the database " + err ; 
                res.send(response)
            }else{
                response.message = "Employee Master getted successfully ... "
                response.status = 1 ;
                response.data = rows ;
                res.send(response)
            }
        }

    })
})


router.put('/',(req,res)=>{


    const { id , username , password , userrole } = req.body;

    const sqlQuery = " UPDATE `user_login` SET `user_name`= ? , `user_pwd`= ?  WHERE `id` = ? "

    conn.query(sqlQuery,[username,password,id ],(err,rows)=>{
        let response = { status: 0, data: { }, message: '' };

        if(err){
            response.message = "Something went wrong in Updating the password " + err ;
            res.send(response)
        }else{
            response.message = "Password updated Successfully ! " ; 
            response.status = 1 ;
            res.send(response)
        }
        
    })
})


router.post('/',(req,res)=>{

    const { id , username , password , userrole , empid } = req.body;

     const sqlQuery = " INSERT INTO `user_login` (emp_id,user_name, user_pwd,user_role) VALUES (?,?,?,?)"

     conn.query(sqlQuery,[empid,username,password,userrole ],(err,rows)=>{
        let response = { status: 0, data: { }, message: '' };

        if(err){
            response.message = "Something went wrong in creating a user " + err ;
            res.send(response)
        }else{
            response.message = "User Created Successfully ! " ; 
            response.status = 1 ;
            res.send(response)
        }
        
    })
})




export default router;