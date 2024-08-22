import express from "express";

import conn from "../../sql.js";

const router = express.Router();
const temp_date =  new Date();
const monthnsss = temp_date.getMonth()+1;
const cur_timestamp = temp_date.getFullYear()+"-"+monthnsss+"-"+temp_date.getDate()+" "+temp_date.getHours()+":"+temp_date.getMinutes()+":"+temp_date.getSeconds();


router.post('/selected',(req,res)=>{
    const candidate_id = req.body.candidate_id;
    const round=req.body.round;
    const interviewName=req.body.interviewName;
    const result=req.body.result;
    const comments=req.body.comments;
    const selectedSalary=req.body.selectedSalary;
    const selectedSalaryAcc=req.body.selectedSalaryAcc;
    const selectedBonus=req.body.selectedBonus;
    const selectedBonusVal=req.body.selectedBonusVal;
    const selectedDOJ=req.body.selectedDOJ;
    const selectedCTC=req.body.selectedCTC;
    const selectedNet=req.body.selectedNet;
    const selectedDesi=req.body.selectedDesi;
    const selectedCamp=req.body.selectedCamp;

    let sql_query = "INSERT INTO interview_selected (candidate_id, interview_round, created_by, "
        sql_query += "salary_offered, salary_accepted, bonus_applicable, bonus_amt, date_of_joining, "
        sql_query += "ctc_offered, net_offered, offered_designation, campaign, comments,created_at) VALUES ";
        sql_query += "(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    let data_row = [candidate_id, round, interviewName, selectedSalary, selectedSalaryAcc,
                    selectedBonus, selectedBonusVal, selectedDOJ,selectedCTC,selectedNet,
                    selectedDesi,selectedCamp,comments,cur_timestamp]; 
    
    conn.query(sql_query,data_row,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            let update_query  = "UPDATE candidate_master SET round_6=? , updated_by=?,updated_at=?,result=? , designation=?,round_6_by=?, round_6_at=?";
                    update_query += "WHERE id="+candidate_id+" ";
            let update_data = [result,interviewName,cur_timestamp,result,selectedDesi,interviewName,cur_timestamp]; 
            conn.query(update_query,update_data,(err,rows)=>{
                if(!err)
                {
                    response.message = "Success";
                    res.send(response);
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


router.post('/rejected',(req,res)=>{
    const candidate_id = req.body.candidate_id;
    const round = req.body.round;
    const interviewName = req.body.interviewName;
    const result = req.body.result;
    const comments = req.body.comments;
    const reason = req.body.reason;


    let sql_query = "INSERT INTO interview_rejected (candidate_id, interview_round, created_by, ";
        sql_query += "result, reason, comments) VALUES (?,?,?,?,?,?)";
    
    let data_row = [candidate_id, round, interviewName, result, reason, comments];

    conn.query(sql_query,data_row,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            let update_query  = "UPDATE candidate_master SET round_6=? , updated_by=?,updated_at=?, result=? ";
                    update_query += "WHERE id="+candidate_id+" ";
            let update_data = [result,interviewName,cur_timestamp,result]; 
            conn.query(update_query,update_data,(err,rows)=>{
                if(!err)
                {
                    response.message = "Success";
                    res.send(response);
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


router.post('/hold',(req,res)=>{
    const candidate_id = req.body.candidate_id;
    const round = req.body.round;
    const interviewName = req.body.interviewName;
    const salary = req.body.salary;
    const designation = req.body.designation;
    const result = req.body.result;
    const comments = req.body.comments;


    let sql_query = "INSERT INTO interview_hold (candidate_id, interview_round, created_by, ";
        sql_query += "salary_offered, designation, result, comments) VALUES (?,?,?,?,?,?,?)";
    
    let data_row = [candidate_id, round, interviewName, salary, designation, result, comments];
    
    conn.query(sql_query,data_row,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            let update_query  = "UPDATE candidate_master SET round_6=? , updated_by=?, result=?, designation=?";
                    update_query += "WHERE id="+candidate_id+" ";
            let update_data = [result,interviewName,result,designation]; 
            conn.query(update_query,update_data,(err,rows)=>{
                if(!err)
                {
                    response.message = "Success";
                    res.send(response);
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


router.post('/shortlist',(req,res)=>{
    const candidate_id = req.body.candidate_id;
    const round = req.body.round;
    const interviewName = req.body.interviewName;
    const salary = req.body.salary;
    const designation = req.body.designation;
    const campaign = req.body.campaign;
    const result = req.body.result;
    const comments = req.body.comments;


    let sql_query = "INSERT INTO interview_shortlist (candidate_id, interview_round, created_by,"
        sql_query += "salary_offered, designation, campaign, result, comments) VALUES ";
        sql_query += "(?,?,?,?,?,?,?,?)";

    let data_row = [candidate_id, round, interviewName, salary, designation, campaign, result, comments];

    conn.query(sql_query,data_row,(err,rows)=>{
        let response = {status : 0,data : [], message : ""};
        if(!err)
        {
            let update_query  = "UPDATE candidate_master SET round_6=? , updated_by=?, result=? , designation=?";
                    update_query += "WHERE id="+candidate_id+" ";
            let update_data = [result,interviewName,result,designation]; 
            conn.query(update_query,update_data,(err,rows)=>{
                if(!err)
                {
                    response.message = "Success";
                    res.send(response);
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