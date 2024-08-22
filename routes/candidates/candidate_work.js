
import express from "express";


import conn from "../../sql.js";

const work_router = express.Router();


/* insert work detals
[{
      company1 : "",
      company1From : "",
      company1To:"",
      company1Desi : "",
      company1Refname : "",
      company1Refmob : "",
      company1Sal : ""
    },
    {
      company2 : "",
      company2From : "",
      company2To:"",
      company2Desi : "",
      company2Refname : "",
      company2Refmob : "",
      company2Sal : ""
    },
    {
      company3 : "",
      company3From : "",
      company3To:"",
      company3Desi : "",
      company3Refname : "",
      company3Refmob : "",
      company3Sal : ""
    },
    {
      company4 : "",
      company4From : "",
      company4To:"",
      company4Desi : "",
      company4Refname : "",
      company4Refmob : "",
      company4Sal : ""
    },
 {"candidate_id" : "2"}]
*/
work_router.post('/',(req,res)=>{

    const company1 = req.body[0].company1;
    const company1From = req.body[0].company1From;
    const company1To = req.body[0].company1To;
    const company1Desi = req.body[0].company1Desi;
    const company1Refname = req.body[0].company1Refname;
    const company1Refmob = req.body[0].company1Refmob;
    const company1Sal = req.body[0].company1Sal;

    const company2 = req.body[1].company2;
    const company2From = req.body[1].company2From;
    const company2To = req.body[1].company2To;
    const company2Desi = req.body[1].company2Desi;
    const company2Refname = req.body[1].company2Refname;
    const company2Refmob = req.body[1].company2Refmob;
    const company2Sal = req.body[1].company2Sal;

    const company3 = req.body[2].company3;
    const company3From = req.body[2].company3From;
    const company3To = req.body[2].company3To;
    const company3Desi = req.body[2].company3Desi;
    const company3Refname = req.body[2].company3Refname;
    const company3Refmob = req.body[2].company3Refmob;
    const company3Sal = req.body[2].company3Sal;

    const company4 = req.body[3].company4;
    const company4From = req.body[3].company4From;
    const company4To = req.body[3].company4To;
    const company4Desi = req.body[3].company4Desi;
    const company4Refname = req.body[3].company4Refname;
    const company4Refmob = req.body[3].company4Refmob;
    const company4Sal = req.body[3].company4Sal;

    const candidate_id = req.body[4].candidate_id;


    let sql_query = "INSERT INTO candidate_work ";
        sql_query += "(candidate_id,company_1, duration_1_from, duration_1_to, designation_1, ref_1_name, ref_1_mobile, net_salary_1,";
        sql_query += "company_2, duration_2_from, duration_2_to, designation_2, ref_2_name, ref_2_mobile, net_salary_2,";
        sql_query += "company_3, duration_3_from, duration_3_to, designation_3, ref_3_name, ref_3_mobile, net_salary_3,";
        sql_query += "company_4, duration_4_from, duration_4_to, designation_4, ref_4_name, ref_4_mobile, net_salary_4) ";
        sql_query += "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)" ;
        
    
    conn.query(sql_query,
        [candidate_id,company1,company1From,company1To,company1Desi,company1Refname,company1Refmob,company1Sal,
            company2,company2From,company2To,company2Desi,company2Refname,company2Refmob,company2Sal,
            company3,company3From,company3To,company3Desi,company3Refname,company3Refmob,company3Sal,
            company4,company4From,company4To,company4Desi,company4Refname,company4Refmob,company4Sal],(err,rows)=>{
                
                let response = {status : 0,data : [], message : ""};

                if(!err)
                {
                    response.message = "Work Details Updated!!!";
                    res.send(response);
                }
                else{
                    response.status = 1;
                    response.message = "Something Went Wrong!!! "+JSON.stringify(err);
                    res.send(response);
                }

    });    
});


export default work_router;


