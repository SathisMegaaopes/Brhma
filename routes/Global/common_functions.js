import conn from "../../sql.js";
import { generateEmployeeObject } from "../Utlis/index.js";


const fnGetEmployeeDetails = () =>{

     const emp_details = "SELECT * FROM emp_master WHERE emp_id in (SELECT user_name FROM user_login) ORDER BY emp_name ASC";

     conn.query(emp_details,(err,res)=>{
        if(!err)
            {
                const changedOne = generateEmployeeObject(res);
                return changedOne;
            }
            else
            {
                return err;
            }
     });
}

exports.fnGetEmployeeDetails = fnGetEmployeeDetails;