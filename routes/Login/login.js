import express from "express";
import conn from "../../sql.js";


const router = express.Router();

/* get all candidates */
router.post('/validateUser', (req, res) => {
    let user_name = req.body.user_name;
    let user_pwd = req.body.user_pwd;

    let sql_query = "SELECT * FROM user_login WHERE ";
    sql_query += "user_name=? AND user_pwd=?";

    conn.query(sql_query, [user_name, user_pwd], (err, rows) => {
        let response = { status: 0, data: [], message: "" };

        if (!err && rows.length !== 0) {

            const d = new Date();
            let login_time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            let user_id = rows[0].id;

            let update_query = "UPDATE user_login SET login_time = ? WHERE id=?";

            conn.query(update_query, [login_time, user_id], (err1, rows1) => {
                if (!err1 && rows1.length !== 0) {
                    let user_query = "SELECT * FROM emp_master WHERE emp_id=?";

                    conn.query(user_query, [rows[0].user_name], (err2, rows2) => {
                        if (!err2 && rows2.length !== 0) {
                            const result = generateEmployeeObject(rows2[0])
                            // rows[0].user_details = rows2[0];
                            rows[0].user_details = result;
                            response.data = rows;
                            response.message = "Success";
                            res.send(response);
                        }
                        else {
                            console.log(JSON.stringify(err1));
                            response.status = 1;
                            response.message = "Invalid Username / Password";
                            response.errorMessage = JSON.stringify(err2);
                            res.send(response);
                        }
                    });

                }
                else {
                    console.log(JSON.stringify(err1));
                    response.status = 1;
                    response.message = "Invalid Username / Password";
                    response.errorMessage = JSON.stringify(err1);
                    res.send(response);
                }
            });

        }
        else {
            response.status = 1;
            response.message = "Invalid Username / Password";
            response.errorMessage = JSON.stringify(err);
            res.send(response);
        }
    });
});


function generateEmployeeObject(arr) {

        return {
            "id": arr.id,
            "emp_id": arr.emp_id,
            "emp_name": arr.f_name + " " + arr.l_name   , 
            "emp_destination": arr.designation,
            "status": arr.status,
            "reporting_team_lead_manager": arr.reporting_manager, 
            "process": arr.designation,
            "joining_date": arr.DOJ 
        };
}


export default router;