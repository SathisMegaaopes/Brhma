import express from "express";


import conn from "../../sql.js";
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    host : "brhma.org.in",
    port : "465",
    secure:true,
    auth : {
        user : "no-reply@brhma.org.in",
        pass : "Megaoopes@brhma"
    }
  });

const router = express.Router();


/*

*/
router.post('/',(req,res)=>{
    const candidate_id = req.body.candidate_id;
    const name1 = req.body.name1;
    const mobile1 = req.body.mobile1;
    const name2 = req.body.name2;
    const mobile2 = req.body.mobile2;
    const name3 = req.body.name3;
    const mobile3 = req.body.mobile3;
    const name4 = req.body.name4;
    const mobile4 = req.body.mobile4;

    
   
   

        

        let sql_query = "INSERT INTO candidate_reference_master (candidate_id,name_1,mobile_1,name_2,mobile_2,";
        sql_query += "name_3,mobile_3,name_4,mobile_4) VALUES";
        sql_query += "(?,?,?,?,?,?,?,?,?)";

    conn.query(sql_query,
        [candidate_id,name1,mobile1,name2,mobile2,name3,mobile3,name4,mobile4],
        (err,rows)=>{
            let response = {status : 0,data : [], message : ""};

            if(!err)
            {
                let select_query = "SELECT * FROM candidate_master WHERE id=?";
                conn.query(select_query,[candidate_id],(err1,rows1)=>{
                    if(!err1)
                    {
                        let candidate_details = rows1[0];
                        let html_content = "<p>Dear "+candidate_details.f_name_basic.charAt(0).toUpperCase() + candidate_details.f_name_basic.slice(1)+" "+candidate_details.l_name_basic.charAt(0).toUpperCase() + candidate_details.l_name_basic.slice(1)+"</p>Welcome to Megaaopes Solutions!"
                    
                    html_content += "<p> We are delighted to have you here today for your interview."
                    html_content += " We appreciate the time you have taken to fill out the online application form "
                    html_content += "and for coming in for the interview.</p>";

                    html_content += "<p><b>Interview Details : </b></p>";
                    html_content += "<ul>";
                    html_content += "<li>Date & Time: "+candidate_details.created_at+"</li>";
                    html_content += "<li>Location : Megaaopes Solutions</li>";
                    html_content += "</ul>";

                    
                    html_content += "<p>Our interview process consists of multiple rounds, "
                    html_content += "and it should not take more than two hours to complete. "
                    html_content += "We appreciate your patience throughout this process.</p>"
                   
                    html_content += "<p>If you have any questions or need assistance during your visit, "
                    html_content += "please do not hesitate to reach out to our team at hr@megaaopes.com. "
                    html_content += "Please do not forget to mention the Reference number in the subject line.</p>"
                   
                    html_content += "<p>Thank you once again for your interest in joining Megaaopes Solutions. We look forward to a productive session with you.</p>";
                    html_content += "<p>Regards,</p><p>Megaaopes Solutions</p>"
            
            
                    let mailOption = {
                        from : "hr@megaaopes.com",
                        to : candidate_details.email_basic,
                        cc : "kannan.r@megaaopes.com, santhoshc22@gmail.com",
                        subject : "Welcome to Megaaopes Solutions – "+candidate_details.candidate_id,
                        html : html_content
                    }
            
                   
                    transporter.sendMail(mailOption,(err,info)=>{
                        if(err)
                        {
                            console.log("EMAIL : "+err);
                        }
                        else
                        {
                            console.log(info.response);
                        }
                    });
                    }
                    else
                    {
                        console.log("ERR" , err1);
                    }
                });
                
                response.message = "Referral Details Updated!!!";
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