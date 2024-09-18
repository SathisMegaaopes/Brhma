import mysql from "mysql"




const conn = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
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

function generateEmployeeObject(arr) {

  return arr.map((item) => {
      return {
          "id": item.id,
          "emp_id": item.emp_id,
          "emp_name": item.f_name + " " + item.l_name , 
          "emp_destination": item.designation,
          "status": item.status ,
          "reporting_team_lead_manager": item.reporting_manager, 
          "process": item.designation,
          "joining_date": item.DOJ 
      };
  });
}


export function gettingDepartment(conn) {
  return new Promise((resolve, reject) => {
    const query = "SELECT DISTINCT department FROM `emp_master`";

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

    const query = "SELECT DISTINCT department , team FROM `emp_master`";

    conn.query(query, (err, results) => {
      if (err) {
        return reject('Error selecting the team Data ' + err.stack)
      }
      resolve(results)
    })

  })
}


export function updateDepartment(conn, data) {
  const values = data.map(item => item.department);


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
          dept_id: nameToIdMap[data.department],
          name: data.team
        }));
      };

      const finalOut = outputs(data, results);

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


export function updateNametoId() {
  return new Promise((resolve, reject) => {
    const query1 = "SELECT * FROM `emp_master`"

    conn.query(query1, (err, results) => {
      if (err) {
        return reject(err)
      }

      const alldump = results;

      // const query2 = 'SELECT `emp_id`,`emp_name` FROM `emp_master`';
      const query2 = 'SELECT * FROM `emp_master`';

      conn.query(query2, (err, results) => {
        if (err) {
          return reject(err);
        }

        // const employeemaster = results;
        const result = generateEmployeeObject(results)

        function getEmpIdByName(name) {
          if (!name) {
            return name;
          } else {

            const employee = result.find(emp => emp.emp_name.toLowerCase().includes(name.toLowerCase()));
            return employee ? employee.emp_id : name;
          }
        }


        for (let i = 0; i < alldump.length; i++) {

          const emplyeeid = alldump[i]['emp_id']

          const reportingTeamLead = alldump[i]["reporting_team_lead"];

          const reportinManager = alldump[i]["reporting_manager"];

          const teamleadID = getEmpIdByName(reportingTeamLead)

          const managerID = getEmpIdByName(reportinManager)

          const query3 = ' UPDATE `emp_master` SET `reporting_team_lead` = ?,`reporting_manager` = ? WHERE `emp_id` = ? '

          conn.query(query3, [teamleadID, managerID, emplyeeid], (err, results) => {
            if (err) {
              return reject(err)
            }
            console.log(results)
          })
        }
        conn.end()
      })
    })
  })
}




export function DepartmentoId() {
  return new Promise((resolve, reject) => {
    const query1 = "SELECT `department` FROM `emp_master`"

    conn.query(query1, (err, results) => {
      if (err) {
        return reject(err)
      }

      const alldump = results;

      const query2 = 'SELECT `id`,`name` FROM `dept_master`';

      conn.query(query2, (err, results) => {
        if (err) {
          return reject(err);
        }

        const departmentmaster = results;

        const departmentIdMap = departmentmaster.reduce((acc, department) => {
          acc[department.name] = department.id;
          return acc;
        }, {});


        const departmentsWithId = alldump.map(department => {
          const id = departmentIdMap[department.department];
          return id ? { department : id } : department;
        });


        const query3 = 'SELECT * FROM `emp_master`';

        conn.query(query3, (err, results) => {
          if (err) {
            return reject(err);

          }

          for (let i = 0; i < results.length; i++) {
            const rowid = results[i]["emp_id"]

            const departID = departmentsWithId[i].department

            const query4 = 'UPDATE `emp_master` SET `department` = ? WHERE `emp_id` = ?'

            conn.query(query4, [departID, rowid], (err, results) => {
              if (err) {
                return reject(err);
              }

              console.log('Successfully updated department name to ID')
            })
          }

          conn.end()
        })

      })
    })
  })
}


export function TeamtoId() {
  return new Promise((resolve, reject) => {
    const query1 = "SELECT `team` FROM `emp_master`"

    conn.query(query1, (err, results) => {
      if (err) {
        return reject(err)
      }

      const alldump = results;


      const query2 = 'SELECT `id`,`name` FROM `team_master`';

      conn.query(query2, (err, results) => {
        if (err) {
          return reject(err);
        }

        const departmentmaster = results;


        const departmentIdMap = departmentmaster.reduce((acc, department) => {
          acc[department.name] = department.id;
          return acc;
        }, {});

        const departmentsWithId = alldump.map(department => {
          const id = departmentIdMap[department.team];
          return id ? { team : id} : department;
        });
        

        const query3 = 'SELECT * FROM `emp_master`';

        conn.query(query3, (err, results) => {
          if (err) {
            return reject(err);

          }

          for (let i = 0; i < results.length; i++) {

            const rowid = results[i]["emp_id"]

            const departID = departmentsWithId[i].team

            const query4 = 'UPDATE `emp_master` SET `team` = ? WHERE `emp_id` = ?'

            conn.query(query4, [departID, rowid], (err, results) => {
              if (err) {
                return reject(err);
              }

              console.log('Successfully updated TeamName to ID')
            })
          }

          conn.end()
        })

      })
    })
  })
}


// Changing Teamname into ID

// (async () => {
//   try {
//     TeamtoId()
//   } catch (err) {
//     console.log(err)
//   }
// })()



// Changing department to ID

// (async () => {
//   try {
//     DepartmentoId()
//   } catch (err) {
//     console.log(err)
//   }
// })()



// updaete the name into id 


(async () => {
  try {
    updateNametoId()
  } catch (err) {
    console.log(err);
  }
})()



//This is the first one ( Dump department to department_master )
 
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



// this is the second one ( Dump team to Team_master )

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



// UPDATE `dump` 
// SET `reporting_team_lead` = ELT(FLOOR(1 + (RAND() * 4)), 'Kannan R', 'Shamala Srinivas', 'Manoj Kumar G', 'Sathish Kumar') 
// WHERE `emp_id` != 18001;

// UPDATE `dump` SET `reporting_team_lead` = 'Shamala Nagaveni S' WHERE `reporting_team_lead` = 'Shamala Srinivas';




