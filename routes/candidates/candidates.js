import express, { Router } from "express";
import conn from "../../sql.js";

const router = express.Router();


/* get all candidates */
router.get('/', (req, res) => {

    const { employid, fromdate, todate } = req.query;

    console.log(employid,fromdate,todate)

    let query = "SELECT * FROM candidate_master";
    let params = [];

    if (employid) {
        query += " WHERE created_by = ?";
        params.push(employid);
        if (fromdate && todate) {
            query += " AND created_at BETWEEN ? AND ?";
            params.push(fromdate, todate);
        }
    } else if (fromdate && todate) {
        query += " WHERE created_at BETWEEN ? AND ?";
        params.push(fromdate, todate);
    }

    query += " ORDER BY id DESC";

    // conn.query("SELECT * FROM candidate_master ORDER BY id DESC", (err, rows) => {
    console.log('This is the api hitted for the form and to date with emplyod id',query)

    conn.query(query, params, (err, rows) => {

        let response = { status: 0, data: [], message: "" };
        if (!err) {
            const emp_details = "SELECT * FROM employee_master";
            conn.query(emp_details, (err1, res1) => {
                if (!err1) {
                    response.data = rows;
                    response.emp_details = res1;
                    response.message = "Success";
                    res.send(response);
                }

                else {
                    response.status = 1;
                    response.message = "Something went worng !!" + JSON.stringify(err);
                    res.send(response);
                }
            });


        }
        else {
            response.status = 1;
            response.message = "Something went worng !!" + JSON.stringify(err);
            res.send(response);
        }
    });
});

/* get all candidates with date range*/
router.get('/searchByDate/:from/:to', (req, res) => {
    console.log(req.params, 'important')
    const sql = "SELECT * FROM candidate_master WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC";
    const sql_data = [req.params.from, req.params.to];

    conn.query(sql, sql_data, (err, rows) => {
        let response = { status: 0, data: [], message: "" };
        if (!err) {
            const emp_details = "SELECT * FROM employee_master WHERE emp_id in (SELECT user_name FROM user_login) ORDER BY emp_name ASC";
            conn.query(emp_details, (err1, res1) => {
                if (!err1) {
                    response.data = rows;
                    response.emp_details = res1;
                    response.message = "Success";
                    res.send(response);
                }

                else {
                    response.status = 1;
                    response.message = "Something went worng !!" + JSON.stringify(err);
                    res.send(response);
                }
            });
        }
        else {
            response.status = 1;
            response.message = "Something went worng !!" + JSON.stringify(err);
            res.send(response);
        }
    });
});




/* validate mobile number */

//new code
router.get('/:mobile', (req, res) => {
    const mobile = req.params.mobile;

    conn.query("SELECT * FROM candidate_master WHERE mobile_basic = ?", [mobile], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 1, message: "Something went wrong!", error: err });
        }

        const emp_details_query = "SELECT * FROM employee_master";
        conn.query(emp_details_query, (err1, empDetails) => {
            if (err1) {
                return res.status(500).json({ status: 1, message: "Something went wrong!", error: err1 });
            }

            let response = {
                status: 0,
                message: "Mobile Number Does Not Exist!",
                emp_details: empDetails
            };

            if (rows.length > 0) {
                const candidate = rows[0];
                const counter = candidate.cc;

                response.status = counter === 0 ? 0 : 1;
                response.message = counter === 0 ? "Mobile Number Does Not Exist!" : "Mobile Number Exists!";
                response.candidate_details = candidate;
            }

            res.send(response);
        });
    });
});




/* get candidate details based on id or name */

router.get('/searchCandidate/:id', (req, res) => {
    let search_data = req.params.id;

    let sql_query = "SELECT * FROM candidate_master WHERE ";
    sql_query += "f_name_basic LIKE ? OR candidate_id LIKE ?  OR ";
    sql_query += "mobile_basic LIKE ? ";

    conn.query(sql_query, ['%' + search_data + '%', '%' + search_data + '%', '%' + search_data + '%'], (err, rows) => {
        let response = { status: 0, data: [], message: "" };
        if (!err) {
            const emp_details = "SELECT * FROM employee_master";
            conn.query(emp_details, (err1, res1) => {
                if (!err1) {
                    response.emp_details = res1;
                    response.data = rows;
                    res.send(response);
                }
                else {
                    response.status = 1;
                    response.message = "No Results";
                    response.errorMessage = JSON.stringify(err);
                    res.send("Something Went Wrong!! " + response);
                }
            });

        }
        else {
            response.status = 1;
            response.message = "No Results";
            response.errorMessage = JSON.stringify(err);
            res.send("Something Went Wrong!! " + response);
        }
    });
});


/* insert new candidate details 
{
    "mobile_number": "9916663853",
    "fname": "santhosh",
    "lname": "chella",
    "alt_mobile": "123",
    "email": "santhoshc22@gmail.com",
    "gender": "Male",
    "designation": "Customer Service Representative",
    "ref_by": "HR REF",
    "ref_others": ""
}
*/

router.post('/', (req, res) => {

    const mobile_number = req.body.mobile_number;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const alt_mobile = req.body.alt_mobile;
    const email = req.body.email;
    const gender = req.body.gender;
    const designation = req.body.designation;
    const ref_by = req.body.ref_by;
    const ref_others = req.body.ref_others;
    const dob = req.body.dob;
    const years = req.body.years;
    const months = req.body.months;
    const address = req.body.address;
    const hr = req.body.HR !== undefined ? req.body.HR : null;
    const image = req.body.profile_pic;

    //new code
    const candidate_pincode = req.body.pincode;
    const candidate_distance = req.body.distance;

    let new_date = new Date();
    let year = new_date.getFullYear();
    let month = ("0" + (new_date.getMonth() + 1)).slice(-2);
    let date = ("0" + new_date.getDate()).slice(-2);

    let candidate_id = year + month + date;


    console.log(candidate_pincode, 'this is pincode')
    console.log(candidate_distance, 'this is distance')

    //new code
    conn.query("INSERT INTO candidate_master (candidate_id,f_name_basic,l_name_basic,mobile_basic,gender,alt_mobile_basic,email_basic,job_profile_basic,ref_by_basic,ref_by_others,dob,years,months,address,created_by,pincode,distance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [candidate_id, fname, lname, mobile_number, gender, alt_mobile, email, designation, ref_by, ref_others, dob, years, months, address, hr, candidate_pincode, candidate_distance],
        (err, rows) => {
            if (!err) {
                const record_id = rows.insertId;
                const id = "MOS" + candidate_id + record_id;
                conn.query("UPDATE candidate_master SET candidate_id = ? WHERE id= ?", [id, record_id], (err) => {

                    if (!err) {
                        res.send({ status: 0, data: { id: record_id, candidate_id: id }, message: "Candidate created Successfully" });
                    }
                    else {
                        res.send({ status: 1, message: "Something went wrong " + JSON.stringify(err) });
                    }
                });

            }
            else {
                res.send({ status: 0, message: "Something went wrong " + JSON.stringify(err) });
            }
        });

});


/* insert data to candidate education 

{
    "candidate_id": "2",
    "sslc_year": "2004",
    "sslc_university": "SVM1",
    "puc_year": "2006",
    "puc_university": "SVMJC",
    "ug_year": "2010",
    "ug_university": "NHCE",
    "pg_year": "2012",
    "pg_university": "OXFORD"
}
*/


router.post('/education', (req, res) => {
    const candidate_id = req.body.candidate_id;
    const sslc_year = req.body.sslc_year;
    const sslc_university = req.body.sslc_university;
    const puc_year = req.body.puc_year;
    const puc_university = req.body.puc_university;
    const ug_year = req.body.ug_year;
    const ug_university = req.body.ug_university;
    const pg_year = req.body.pg_year;
    const pg_university = req.body.pg_university;

    let sql_query = "INSERT INTO candidate_edu_master ";
    sql_query += "(candidate_id,sslc_year,sslc_university,puc_year,puc_university,ug_year,ug_university,pg_year,pg_university)"
    sql_query += "VALUES (?,?,?,?,?,?,?,?,?)"
    conn.query(sql_query, [candidate_id, sslc_year, sslc_university, puc_year, puc_university,
        ug_year, ug_university, pg_year, pg_university], (err, rows) => {
            let response = { status: 0, data: [], message: "" };
            if (!err) {
                response.status = 0;
                response.message = "Candidate Details Updated!!!";
                res.status(200).send(response);
            }
            else {
                response.status = 1;
                response.message = "Something Went Wrong!! " + err;
                res.status(200).send(response);
            }

        });

});


router.delete('/', (req, res) => {

    const { candidateid } = req.body;

    const query1 = "SELECT * FROM `candidate_master` WHERE `candidate_id` = ? "

    conn.query(query1, [candidateid], (err, rows) => {
        if (err) {
            res.send(err)
        }

        const candidateid = rows.map((item) => {
            return item.id
        })

        const candidateDeleteid = candidateid[0]

        const query2 = "DELETE FROM `candidate_master` WHERE `id`= ? ";

        conn.query(query2, [candidateDeleteid], (err, rows) => {
            // if (err) {
            //     res.send(err)
            // }

            let response = { status: 0, data: [], message: "" };
            if (err) {
                response.message = err;
                res.send(response)
            }
            else {
                response.status = 1;
                response.message = "The Candidate deleted successfully...";
                res.send(response)
                console.log(rows, 'this is the row , Getting to deleted ')
            }


            // const query3 = " DELETE FROM `candidate_edu_master` WHERE `candidate_id`= ? "

            // conn.query(query3, [candidateDeleteid], (err, rows) => {

            // console.log(rows,'this after delteting the from the candidate_edu_master')

            // let response = { status: 0, data: [], message: "" };
            // if (err) {
            //     response.message = err;
            //     res.send(response)
            // }
            // else {
            //     response.status = 1;
            //     response.message = "The Candidate deleted successfully...";
            //     res.send(response)
            // }
            // })
        })
    })

})




export default router;



// const query3 = "DELETE FROM `candidate_edu_master` WHERE `candidate_id`= ?; DELETE FROM `candidate_personal`  WHERE `candidate_id`= ? ; DELETE FROM `candidate_reference_master` WHERE `candidate_id` = ? ; "
// conn.query(query3, [candidateDeleteid, candidateDeleteid, candidateDeleteid], (err, row) => {
