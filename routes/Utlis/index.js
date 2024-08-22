import conn from "../../sql.js";


const fnGetCandidatedetails = (id) =>{
    let data = null;
    let select_query = "SELECT * FROM candidate_master WHERE candidate_id=?";
    conn.query(select_query,[id],(err1,rows1)=>{
        if(!err1)
        {
            
           data = rows1;
           
        }
        else
        {
            data = JSON.stringify(err1);
        }
    });
    console.log("FROM FUNC : ",data);
    return data
}


export default fnGetCandidatedetails;
