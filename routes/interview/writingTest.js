import express from "express";

import conn from "../../sql.js";

const router = express.Router();
const temp_date =  new Date();
const monthnsss = temp_date.getMonth()+1;
const cur_timestamp = temp_date.getFullYear()+"-"+monthnsss+"-"+temp_date.getDate()+" "+temp_date.getHours()+":"+temp_date.getMinutes()+":"+temp_date.getSeconds();


router.post('/',(req,res)=>{
    
       const candidate_id = req.body.candidate_id;
       const  round = req.body.round;
        const interviewName = req.body.interviewName;
        const rating = req.body.rating;
        
        const status = req.body.status;
        const comments = req.body.comments;


    let sql_query = "INSERT INTO interview_writing ";
        sql_query += "(candidate_id,interview_round,created_by,rating,result,comments) VALUES ";
        sql_query += "(?,?,?,?,?,?)";
    let data_row = [candidate_id,round,interviewName,rating,status,comments];
    
    conn.query(sql_query,data_row,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            let update_query  = "UPDATE candidate_master SET round_3=? , updated_by=?,updated_at=?,round_3_at=?,round_3_by=? ";
                    update_query += "WHERE id="+candidate_id+" ";
            let update_data = [status,interviewName,cur_timestamp,cur_timestamp,interviewName]; 
            conn.query(update_query,update_data,(err,rows)=>{
                if(!err)
                {
                     
                    let insert_query = "";
                    if(status===1)
                        {
                            insert_query = "INSERT INTO interview_selected (candidate_id, interview_round, created_by,created_at) ";
                            insert_query += "VALUES (?,?,?,?)";
                        }
                        else if(status===2)
                            {
                                insert_query = "INSERT INTO interview_rejected (candidate_id, interview_round, created_by,created_at) ";
                        insert_query += "VALUES (?,?,?.?)";
                            }
                            else if(status===3)
                                {
                                    insert_query = "INSERT INTO interview_hold (candidate_id, interview_round, created_by,created_at) ";
                            insert_query += "VALUES (?,?,?,?)";
                                }
                                else if(status===4)
                                    {
                                        insert_query = "INSERT INTO interview_shortlist (candidate_id, interview_round, created_by,created_at) ";
                                insert_query += "VALUES (?,?,?,?)";
                                    }
                    
                    conn.query(insert_query,[candidate_id,round,interviewName,cur_timestamp],(err2,rows2)=>{
                        if(!err2)
                            {
                                response.message = "Success";
                                res.send(response);
                            }

                    });
                    //response.message = "Success";
                    //res.send(response);
                }
                else{
                    response.status = 1;
                    response.message = JSON.stringify(err)+"\n"+sql_query;
                    res.send(response)
                }
                
            });
        }
        else{
            response.status = 1;
            response.message = JSON.stringify(err)+"\n"+sql_query;
            res.send(response)
        }
    });
    
});


export default router;