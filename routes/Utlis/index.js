import conn from "../../sql.js";


const fnGetCandidatedetails = (id) => {
    let data = null;
    let select_query = "SELECT * FROM candidate_master WHERE candidate_id=?";
    conn.query(select_query, [id], (err1, rows1) => {
        if (!err1) {

            data = rows1;

        }
        else {
            data = JSON.stringify(err1);
        }
    });
    console.log("FROM FUNC : ", data);
    return data
}


function generateEmployeeObject(arr) {

    return arr.map((item) => {
        return {
            "id": item.id,
            "emp_id": item.emp_id,
            "emp_name": item.f_name + " " + item.l_name,
            "emp_destination": item.designation,
            "status": item.status,
            "reporting_team_lead_manager": item.reporting_manager,
            "process": item.designation,
            "joining_date": item.DOJ
        };
    });
}


function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `%${year}-${month}-${day}%`;
}


function getCurrentMonthYear() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    return `%${year}-${month}%`;
}

export { fnGetCandidatedetails, generateEmployeeObject, getTodayDate, getCurrentMonthYear }
