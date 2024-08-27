import express from "express";
import conn from "../../sql.js";
import e from "express";

const router = express.Router();


router.get('/', (req, res) => {

    const { id, role } = req.query;

    // const sql_query =  role !==1 ? '' : "SELECT * FROM `to_do_list` WHERE `created_by`= ? "

    const sql_query = "SELECT * FROM `to_do_list` "

    conn.query(sql_query, [id],
        (err, rows) => {
            let response = { status: 0, data: { assignedToMe: [], otherTasks: [] }, message: '' };

            if (!err) {

                const assignedToMe = role === '1' ? rows.filter(task => String(task.task_assignee).trim() === String(id).trim()) :
                    rows.filter(task => String(task.task_assignee).trim() === String(id).trim() && String(task.created_by).trim() === String(id).trim());

                // const otherTasks = rows.filter(task => String(task.created_by).trim() === String(id).trim());

                const otherTasks = role === '1' ? rows.filter(task => String(task.task_assignee).trim() !== String(id).trim() && String(task.created_by).trim() === String(id).trim()) :
                    rows.filter(task => String(task.task_assignee).trim() === String(id).trim() && String(task.created_by).trim() !== String(id).trim());


                const assigneeIds = [...new Set(otherTasks.map(task => task.task_assignee))];

                // if(assigneeIds.length === 0) //This is the new Feature that will be added soon

                // const secondQuery = "SELECT `Emp ID`,`f_name` FROM `dump` WHERE`Emp ID`= ? "


                const placeholders = assigneeIds.map(() => '?').join(', ');
                const sqlQuery = `SELECT \`Emp ID\`, \`f_name\` FROM \`dump\` WHERE \`Emp ID\` IN (${placeholders})`;


                conn.query(sqlQuery, assigneeIds, (err, rows) => {
                    if (err) {
                        console.log(' it showing errr', err)

                    } else {

                        const assigneeMap = {};
                        rows.forEach(row => {
                            assigneeMap[row["Emp ID"]] = row.f_name;
                        });

                        const updatedAssignedToMe = otherTasks.map(task => ({
                            ...task,
                            task_assignee: assigneeMap[String(task.task_assignee)] || task.task_assignee
                        }));

                        console.log(updatedAssignedToMe, 'updatedAssignedToMe')

                        response.data.assignedToMe = assignedToMe;
                        response.data.otherTasks = updatedAssignedToMe;
                        response.status = 1;
                        response.message = 'Todo list fetched from the database';
                        res.send(response);

                    }
                })





            } else {

                response.message = 'Something went Wrong' + JSON.stringify(err);
                res.send(response);

            }

        }
    )
})



router.get('/department', (req, res) => {

    const query1 = "SELECT * FROM `dept_master`";

    conn.query(query1, (err, rows) => {

        let response = { status: 0, data: [], message: '' }
        if (err) {
            response.message = "Something went wrong! Please check !" + err;
            res.send(response);
        } else {
            response.status = 1;
            response.message = "Getting all the department data ! ";
            response.data = rows
            res.send(response)
        }
    })
})


router.get('/teams', (req, res) => {

    const { id } = req.query;

    const query1 = id ? 'SELECT * FROM `team_master` WHERE `dept_id`= ? ' : ' SELECT * FROM `team_master` ';

    conn.query(query1, [id], (err, rows) => {
        let response = { status: 0, data: [], message: '' }
        if (err) {
            response.message = "Something went wrong! Please check !" + err;
            res.send(response);
        } else {
            response.status = 1;
            response.message = " All the teams name queried ! ";
            response.data = rows
            res.send(response)
        }
    });
})




router.get('/employee', (req, res) => {

    const { id } = req.query;

    const query1 = id ? 'SELECT * FROM `dump` WHERE `Team`= ? ' : 'SELECT * FROM `dump` ';

    conn.query(query1, [id], (err, rows) => {
        let response = { status: 0, data: [], message: '' }
        if (err) {
            response.message = "Something went wrong! Please check !" + err;
            res.send(response);
        } else {
            response.status = 1;
            response.message = " All the teams name queried ! ";
            response.data = rows
            res.send(response)
        }
    });
})


// task_name - 1  , task_description  - 1 , task_dept  - 1 , task_team   - 1 , task_assignee  - 1 , status  , tat -1  , created_by  ;

router.post('/', (req, res) => {

    const { taskname, taskdes, departid, teamID, employeeID, status, tatValue, userID } = req.body;

    // console.log(taskname, taskdes, departid, teamID, employeeID, status, tatValue, userID)

    const sql_query = "INSERT INTO `to_do_list` ( task_name , task_description , task_dept , task_team , task_assignee , status , tat , created_by )  VALUES (?,?,?,?,?,?,?,?)"

    conn.query(sql_query, [taskname, taskdes, departid, teamID, employeeID, status, tatValue, userID], (err, rows) => {
        // conn.query(sql_query, [taskname, taskdes, departid, teamID, employeeID, status, tatValue], (err, rows) => {
        let response = { status: 0, data: {}, message: '' }
        if (err) {
            response.message = "Something went wrong! Please check !" + err;
            res.send(response);
        } else {
            response.status = 1;
            response.message = "Task added to the todo list ! ";
            res.send(response)
        }
    })
})



router.put('/', (req, res) => {

    const { id, status } = req.body

    // console.log(id, status)


    const query = "UPDATE `to_do_list` SET `status`= ?  WHERE `id`= ? ";

    conn.query(query, [status, id], (err, rows) => {
        let response = { status: 0, data: {}, message: '' }
        if (err) {
            response.message = " Something went wrong at the updating the task status" + err;
            res.send(response)
        } else {
            response.status = 1;
            response.message = "Updated the task successfully"
            res.send(response)
        }
    })

})



export default router;