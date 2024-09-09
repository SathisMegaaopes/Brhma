import express from "express";
import conn from "../../sql.js";

const router = express.Router();

router.post('/',(req,res)=>{


    const candidate_id = req.body.candidate_id;
    const fatherName = req.body.fatherName;
    const fatherAge = req.body.fatherAge;
    const fatherOccu = req.body.fatherOccu;
    const fatherMob = req.body.fatherMob;
    const motherName = req.body.motherName;
    const motherAge = req.body.motherAge;
    const motherOccu = req.body.motherOccu;
    const motherMob = req.body.motherMob;
    const guardName = req.body.guardName;
    const guardAge = req.body.guardAge;
    const guardOccu = req.body.guardOccu;
    const guardMob = req.body.guardMob; 

    let sql_query = "INSERT INTO candidate_personal (candidate_id,father_name, father_age, ";
        sql_query += "father_occupation, father_mobile, mother_name, mother_age,";
        sql_query += "mother_occupation, mother_mobile, guard_name, guard_age,";
        sql_query += " guard_occupation, guard_mobile) VALUES ";
        sql_query += "(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    conn.query(sql_query,
        [candidate_id,fatherName,fatherAge,fatherOccu,fatherMob,
            motherName,motherAge,motherOccu,motherMob,
            guardName,guardAge,guardOccu,guardMob
        ],
        (err,rows)=>{
            let response = {status : 0,data : [], message : ""};

            if(!err)
            {
                response.message = "Personal Details Updated!!!";
                res.send(response);
            }
            else{
                response.status = 1;
                response.message = "Something Went Wrong!!! "+JSON.stringify(err);
                res.send(response);
            }
    });    
    
});



export default router;