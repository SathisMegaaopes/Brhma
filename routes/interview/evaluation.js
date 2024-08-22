import express from "express";

import conn from "../../sql.js";

const router = express.Router();

const temp_date =  new Date();

const monthnsss = temp_date.getMonth()+1;
const cur_timestamp = temp_date.getFullYear()+"-"+monthnsss+"-"+temp_date.getDate()+" "+temp_date.getHours()+":"+temp_date.getMinutes()+":"+temp_date.getSeconds();

router.post('/',(req,res)=>{
    const candidate_id = req.body.candidate_id;
    const round = req.body.round;
    const interviewName = req.body.interviewName;
    const dress = req.body.dress;
    const grooming=req.body.grooming;
    const body=req.body.body;
    const eye=req.body.eye;
    const appearTotal = req.body.appearTotal;

    const assertive=req.body.assertive;
    const cooperative = req.body.cooperative;
    const responsible = req.body.responsible;
    const dedicated = req.body.dedicated;
    const maturity = req.body.maturity;
    const professional = req.body.professional;
    const ability = req.body.ability;
    const charaterTotal = req.body.charaterTotal;

    const self = req.body.self;
    const intrest = req.body.intrest;
    const career = req.body.career;
    const goalTotal = req.body.goalTotal;

    const commitment = req.body.commitment;
    const knowledge = req.body.knowledge;
    const industry = req.body.industry;
    const mosTotal = req.body.mosTotal;

    const jobReal = req.body.jobReal;
    const matches = req.body.matches;
    const jobTotal = req.body.jobTotal;

    const real = req.body.real;
    const potential = req.body.potential;
    const longtermTotal = req.body.longtermTotal;

    const finalTotal = req.body.finalTotal;
    const final_comments = req.body.comments;
    const result = req.body.result;
    

    let sql_query = "INSERT INTO interview_evaluation ";
        sql_query += "(candidate_id,interview_round,created_by,dress,grooming,";
        sql_query += "body,eye,appear_total,assertive,cooperative,responsible,";
        sql_query += "dedicated,maturity,professional,ability,charater_total,";
        sql_query += "real_rating,interest,career,goal_total,commitment,knowledge,industry,mos_total,";
        sql_query += "job_realistic,job_match,job_total,long_real,long_grow,long_total,";
        sql_query += "final_total,final_comments,result) VALUES ";
        sql_query += "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
        let data_array = [candidate_id,round,interviewName,dress,grooming,
        body,eye,appearTotal,assertive,cooperative,responsible,dedicated,
        maturity,professional,ability,charaterTotal,self,intrest,career,goalTotal,
        commitment,knowledge,industry,mosTotal,jobReal,matches,jobTotal,
        real,potential,longtermTotal,finalTotal,final_comments,result];

        conn.query(sql_query,data_array,(err,rows)=>{
            let response = {status : 0,data : [], message : ""};
            if(!err)
            {
                let update_query = "";
                if(round===1)
                {
                    update_query  = "UPDATE candidate_master SET round_1=? , updated_by=?,updated_at=? ,round_1_by=?,round_1_at=?";
                    update_query += "WHERE id="+candidate_id+" ";
                }
                else if(round===4){
                    update_query  = "UPDATE candidate_master SET round_4=? , updated_by=?,updated_at=? ,round_4_by=?,round_4_at=? ";
                    update_query += "WHERE id="+candidate_id+" ";
                }
                else if(round===5){
                    update_query  = "UPDATE candidate_master SET round_5=? , updated_by=?,updated_at=? ,round_5_by=?,round_5_at=? ";
                    update_query += "WHERE id="+candidate_id+" ";
                }
                
                let update_data = [result,interviewName,cur_timestamp,interviewName,cur_timestamp];
                conn.query(update_query,update_data,(err1,rows1)=>{
                    if(!err1)
                    {
                        let insert_query = "";
                        if(result===1)
                            {
                                insert_query = "INSERT INTO interview_selected (candidate_id, interview_round, created_by,created_at) ";
                                insert_query += "VALUES (?,?,?,?)";
                            }
                            else if(result===2)
                                {
                                    insert_query = "INSERT INTO interview_rejected (candidate_id, interview_round, created_by,created_at) ";
                            insert_query += "VALUES (?,?,?,?)";
                                }
                                else if(result===3)
                                    {
                                        insert_query = "INSERT INTO interview_hold (candidate_id, interview_round, created_by,created_at) ";
                                insert_query += "VALUES (?,?,?,?)";
                                    }
                                    else if(result===4)
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
})


router.get('/getresult/:id/:round',(req,res)=>{
    const candidate_id = req.params.id;
    const round = req.params.round;
    

    let sql_query = "";
    if(parseInt(round)===1 || parseInt(round)===4 ||  parseInt(round)===5)
    {
        sql_query = "SELECT * FROM interview_evaluation WHERE interview_round = ? AND candidate_id = ? ORDER BY created_at DESC LIMIT 1";
        
    }
    else if(parseInt(round)===2)
    {
        sql_query = "SELECT * FROM interview_typing WHERE interview_round = ? AND candidate_id = ?  ORDER BY created_at DESC LIMIT 1";
    }
    else if(parseInt(round)===3)
    {
        sql_query = "SELECT * FROM interview_writing WHERE interview_round = ? AND candidate_id = ?  ORDER BY created_at DESC LIMIT 1";
    }
    else if(parseInt(round)===6)
    {
        sql_query = "SELECT * FROM interview_selected WHERE interview_round = ? AND candidate_id = ?  ORDER BY created_at DESC LIMIT 1";
    }
   
    
    let sql_val = [round,candidate_id];

    conn.query(sql_query,sql_val,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            if(rows.length > 0)
            {
                response.data = rows;
                response.message = "success";
            }
            else{
                response.data = [];
                response.message = "No Records Found";
            }
            
            res.send(response);
        }
        else{
            response.status = 1;
            response.message = "failed "+JSON.stringify(err)+" >> "+sql_query;
            res.send(response);
        }
    });
})

router.get('/gethrresult/:id/:round',(req,res)=>{
    const candidate_id = req.params.id;
    const round = req.params.round;
    
    
    let sql_query = "";
    if(parseInt(round)===1)
    {
        sql_query = "SELECT * FROM interview_selected WHERE candidate_id = ?   ORDER BY created_at DESC LIMIT 1"
    }
    else if(parseInt(round)===2)
    {
        sql_query = "SELECT * FROM interview_rejected WHERE candidate_id = ?   ORDER BY created_at DESC LIMIT 1"
    }
    else if(parseInt(round)===3)
    {
        sql_query = "SELECT * FROM interview_hold WHERE candidate_id = ?   ORDER BY created_at DESC LIMIT 1"
    }
    else if(parseInt(round)===4)
    {
        sql_query = "SELECT * FROM interview_shortlist WHERE candidate_id = ?   ORDER BY created_at DESC LIMIT 1"
    }

    let sql_val = [candidate_id];

    conn.query(sql_query,sql_val,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            if(rows.length > 0)
            {
                response.data = rows;
                response.message = "success";
            }
            else{
                response.data = [];
                response.message = "No Records Found";
            }
            
            res.send(response);
        }
        else{
            response.status = 1;
            response.message = "failed "+JSON.stringify(err)+" >> "+sql_query;
            res.send(response);
        }
    });
    
})

export default router;