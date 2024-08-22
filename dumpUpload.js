import { rejects } from "assert";
import e from "express";
import mysql from "mysql"
import { resolve } from "path";

const conn = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  // database:"megaaopes"
  database: "sathis_megaaopes"
});


conn.connect((err) => {
  if (!err) {
    console.log("DB Connection Success");
  }
  else {
    console.log("DB FAILED" + JSON.stringify(err, undefined, 2));
  }
})



export function gettingDepartment(conn) {
  return new Promise((resolve, reject) => {
    const query = "SELECT DISTINCT Department FROM `dump`";

    conn.query(query, (err, results) => {
      if (err) {
        return reject('Error selecting data: ' + err.stack);
      }
      resolve(results);
    });
  });
}


export function gettingTeam(conn) {
  return new Promise((resolve, reject) => {

    const query = "SELECT DISTINCT Department , Team FROM `dump`";

    conn.query(query, (err, results) => {
      if (err) {
        return reject('Error selecting the Team Data ' + err.stack)
      }
      resolve(results)
    })

  })
}


export function updateDepartment(conn, data) {
  const values = data.map(item => item.Department);
  console.log(values, 'updateDepartment');

  return new Promise((resolve, reject) => {

    const query = "INSERT INTO `dept_master` (`name`, `status`) VALUES ?";
    const insertValues = values.map(department => [department, '1']); // Create an array of arrays for the values

    conn.query(query, [insertValues], (err, results) => {
      if (err) {
        return reject('Error updating data: ' + err.stack);
      }
      resolve('Data updated successfully');
    });
  });
}



export function updateTeams(conn, data) {
  return new Promise((resolve, reject) => {
    const query1 = "SELECT id, name FROM `dept_master`";

    conn.query(query1, (err, results) => {
      if (err) {
        return reject(err);
      }

      const outputs = (rowData, mapping) => {
        const nameToIdMap = mapping.reduce((acc, department) => {
          acc[department.name] = department.id;
          return acc;
        }, {});

        return rowData.map(data => ({
          dept_id: nameToIdMap[data.Department],
          name: data.Team
        }));
      };

      const finalOut = outputs(data, results);
      console.log(finalOut, 'finalOut');

      const formattedData = finalOut.map(item => [item.dept_id, item.name, '1']);

      const query2 = "INSERT INTO `team_master` (`dept_id`, `name`, `status`) VALUES ?";
      conn.query(query2, [formattedData], (err, results) => {
        if (err) {
          return reject('Error Updating the data : ' + err.stack);
        }
        resolve('Data updated successfully');
      });

    });
  });
}


export function updateNametoId(){
  return new Promise((resolve,reject)=>{
    const query1 = "SELECT * FROM `dump`"

    conn.query(query1,(err,results)=>{
      if(err){
        return reject(err)
      }

      const alldump = results;

      const query2 =  'SELECT `emp_id`,`emp_name` FROM `employee_master`' ;

      conn.query(query2,(err,results)=>{
        if(err){
          return reject(err);
        }

        const employeemaster = results;

        // console.log(employeemaster)

        function getEmpIdByName(name) {
          if(!name){
            console.log(name , 'name inside the getname')
            return null;
          }else{
            const employee = results.find(emp => emp.emp_name.toLowerCase().includes(name.toLowerCase()));
            return employee ? employee.emp_id : null;
          }
        }
        

        for(let i=1;i<alldump.length;i++){
          
          const emplyeeid = alldump[i]['Emp ID']

          // console.log(emplyeeid,'emplyeeid')

          const reportingTeamLead = alldump[i]["Reporting Team Lead"];

          // console.log(reportingTeamLead,'reportingTeamLead')

          const teamleadID = getEmpIdByName(reportingTeamLead)

          // console.log(teamleadID,'teamleadID')


          // const query3 ='UPDATE `dump` SET `Reporting Team Lead` = ? WHERE `Emp ID` = ?'
          const query3 =' UPDATE `dump` SET `Reporting Team Lead` = ?,`Reporting Manager` = ? WHERE `Emp ID` = ? '

          conn.query(query3,[teamleadID,teamleadID,emplyeeid],(err,results)=>{
            if(err){
              return reject(err)
            }
            console.log(results)


          })


        }

        conn.end()
      })

      // for(let i=0;i<emplyoeeid.length;i++){
      //   conn.query(query2,emplyoeeid[i],(err,results)=>{
      //     if(err){
      //       console.log(err);
      //     }
      //     // console.log(results)

      //     const query3 = 'UPDATE `dump` SET `name` = ? WHERE `Emp ID` = ?';

      //   })
      // }
    })
  })
}






(async () => {
  try {
    updateNametoId()
  } catch (err) {
    console.log(err);
  }
  // finally {
  //   conn.end((err) => {
  //     if (err) {
  //       console.log('Error ending the conn :' + err.stack);
  //       return;
  //     }
  //     console.log('Connection closed');
  //   })
  // }
})()


// (async () => {
//   try {
//     const selectedData = await gettingDepartment(conn);
//     console.log('Data selected:', selectedData);

//     if (selectedData.length > 0) {
//       const dataToUpdate = selectedData;
//       const updateResult = await updateDepartment(conn, dataToUpdate);
//       console.log(updateResult);
//     }
//   } catch (err) {
//     console.error(err);
//   } finally {
//     conn.end((err) => {
//       if (err) {
//         console.error('Error ending the conn: ' + err.stack);
//         return;
//       }
//       console.log('Connection closed');
//     });
//   }
// })();


// (async () => {
//   try {
//     const selectedData = await gettingTeam(conn);
//     // console.log('Data selected:', selectedData);

//     if (selectedData.length > 0) {
//       const dataToUpdate = selectedData;
//       const updateResult = await updateTeams(conn, dataToUpdate);
//       // console.log(updateResult);
//     }
//   } catch (err) {
//     console.error(err);
//   } finally {
//     conn.end((err) => {
//       if (err) {
//         console.error('Error ending the conn: ' + err.stack);
//         return;
//       }
//       console.log('Connection closed');
//     });
//   }
// })();


