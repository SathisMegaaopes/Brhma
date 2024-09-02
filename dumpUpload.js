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


export function updateNametoId() {
  return new Promise((resolve, reject) => {
    const query1 = "SELECT * FROM `dump`"

    conn.query(query1, (err, results) => {
      if (err) {
        return reject(err)
      }

      const alldump = results;

      const query2 = 'SELECT `emp_id`,`emp_name` FROM `employee_master`';

      conn.query(query2, (err, results) => {
        if (err) {
          return reject(err);
        }

        const employeemaster = results;

        function getEmpIdByName(name) {
          console.log(name, 'name')
          if (!name) {
            return name;
          } else {

            const employee = results.find(emp => emp.emp_name.toLowerCase().includes(name.toLowerCase()));
            return employee ? employee.emp_id : name;
          }
        }


        for (let i = 0; i < alldump.length; i++) {

          const emplyeeid = alldump[i]['Emp ID']

          const reportingTeamLead = alldump[i]["Reporting Team Lead"];

          const reportinManager = alldump[i]["Reporting Manager"];

          const teamleadID = getEmpIdByName(reportingTeamLead)

          const managerID = getEmpIdByName(reportinManager)

          console.log(teamleadID, 'teamleadID')

          console.log(managerID, 'managerID')

          const query3 = ' UPDATE `dump` SET `Reporting Team Lead` = ?,`Reporting Manager` = ? WHERE `Emp ID` = ? '

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
    const query1 = "SELECT `Department` FROM `dump`"

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
          const id = departmentIdMap[department.Department];
          return id ? { Department : id } : department;
        });


        const query3 = 'SELECT * FROM `dump`';

        conn.query(query3, (err, results) => {
          if (err) {
            return reject(err);

          }

          for (let i = 0; i < results.length; i++) {
            const rowid = results[i]["Emp ID"]

            const departID = departmentsWithId[i].Department

            const query4 = 'UPDATE `dump` SET `Department` = ? WHERE `Emp ID` = ?'

            conn.query(query4, [departID, rowid], (err, results) => {
              if (err) {
                return reject(err);
              }

              console.log('Successfully updated Department name to ID')
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
    const query1 = "SELECT `Team` FROM `dump`"

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
          const id = departmentIdMap[department.Team];
          return id ? { Team : id} : department;
        });
        

        const query3 = 'SELECT * FROM `dump`';

        conn.query(query3, (err, results) => {
          if (err) {
            return reject(err);

          }

          for (let i = 0; i < results.length; i++) {

            const rowid = results[i]["Emp ID"]

            const departID = departmentsWithId[i].Team

            const query4 = 'UPDATE `dump` SET `Team` = ? WHERE `Emp ID` = ?'

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



//Changing department to ID

// (async () => {
//   try {
//     DepartmentoId()
//   } catch (err) {
//     console.log(err)
//   }
// })()



// updaete the name into id 


// (async () => {
//   try {
//     updateNametoId()
//   } catch (err) {
//     console.log(err);
//   }``
// })()



//This is the first one ( Dump Department to department_master )
 
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



// this is the second one ( Dump Team to Team_master )

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
// SET `Reporting Team Lead` = ELT(FLOOR(1 + (RAND() * 4)), 'Kannan R', 'Shamala Srinivas', 'Manoj Kumar G', 'Sathish Kumar') 
// WHERE `Emp ID` != 18001;

// UPDATE `dump` SET `Reporting Team Lead` = 'Shamala Nagaveni S' WHERE `Reporting Team Lead` = 'Shamala Srinivas';




