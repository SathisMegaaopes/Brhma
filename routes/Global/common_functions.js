import conn from "../../sql.js";


const fnGetEmployeeDetails = () =>{

     const emp_details = "SELECT * FROM employee_master WHERE emp_id in (SELECT user_name FROM user_login) ORDER BY emp_name ASC";

     conn.query(emp_details,(err,res)=>{
        if(!err)
            {
                return res;
            }
            else
            {
                return err;
            }
     });
}

exports.fnGetEmployeeDetails = fnGetEmployeeDetails;