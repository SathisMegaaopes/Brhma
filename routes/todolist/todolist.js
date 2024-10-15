import express from "express";
import conn from "../../sql.js";

const router = express.Router();


router.get('/', (req, res) => {

    const { id, role } = req.query;

    const sql_query = "SELECT * FROM `to_do_list` WHERE `status` != 4 ORDER BY `id` DESC"

    conn.query(sql_query, [id],
        (err, rows) => {
            let response = { status: 0, data: { assignedToMe: [], otherTasks: [] }, message: '' };

            if (!err) {


                const assignedToMe = role === '1' ? rows.filter(task => String(task.task_assignee).trim() === String(id).trim()) :
                    rows.filter(task => String(task.task_assignee).trim() === String(id).trim() && String(task.created_by).trim() === String(id).trim());


                const otherTasks = role === '1' ? rows.filter(task => String(task.task_assignee).trim() !== String(id).trim() && String(task.created_by).trim() === String(id).trim()) :
                    rows.filter(task => String(task.task_assignee).trim() === String(id).trim() && String(task.created_by).trim() !== String(id).trim());


                const assigneeIds = [...new Set(otherTasks.map(task => task.task_assignee))];

                const assignedbyIds = [...new Set(otherTasks.map(task => task.created_by))]

                const allAssignIds = [...assigneeIds, ...assignedbyIds]


                if (assigneeIds.length === 0) {
                    response.data.assignedToMe = assignedToMe;
                    response.data.otherTasks = otherTasks;
                    response.status = 1;
                    response.message = 'Todo list fetched from the database';
                    res.send(response);
                } else {
                    const placeholders = allAssignIds.map(() => '?').join(', ');

                    const sqlQuery = `SELECT \`emp_id\`, \`f_name\`, \`l_name\` FROM \`emp_master\` WHERE \`emp_id\` IN (${placeholders})`;

                    conn.query(sqlQuery, allAssignIds, (err, rows) => {
                        if (err) {
                            response.message = " Something wentwrong ! " + err;
                            res.send(response);

                        } else {

                            const assigneeMap = {};

                            rows.forEach(row => {
                                assigneeMap[String(row["emp_id"])] = row.f_name + " " + row.l_name;
                            });

                            const updatedAssignedToMe = otherTasks.map(task => ({
                                ...task,
                                task_assignee: assigneeMap[String(task.task_assignee)] || task.task_assignee,
                                created_by_new: assigneeMap[String(task.created_by)] || task.created_by
                            }));

                            response.data.assignedToMe = assignedToMe;
                            response.data.otherTasks = updatedAssignedToMe;
                            response.status = 1;
                            response.message = 'Todo list fetched from the database';
                            res.send(response);

                        }
                    })

                }

            } else {

                response.message = 'Something went Wrong' + JSON.stringify(err);
                res.send(response);

            }

        }
    )
})



router.get('/department', (req, res) => {

    const query1 = "SELECT * FROM `dept_master` WHERE `status` = 1 ";

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

    const query1 = id ? 'SELECT * FROM `emp_master` WHERE `team`= ? ' : 'SELECT * FROM `emp_master` ';

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


router.post('/', (req, res) => {

    const { taskname, taskdes, departid, teamID, employeeID, status, startDate, endDate, userID } = req.body;

    const sql_query = "INSERT INTO `to_do_list` ( task_name , task_description , task_dept , task_team , task_assignee , status , start_dateTime , end_dateTime , created_by )  VALUES (?,?,?,?,?,?,?,?,?)"

    conn.query(sql_query, [taskname, taskdes, departid, teamID, employeeID, status, startDate, endDate, userID], (err, rows) => {
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

    const { id, status, username, comment } = req.body;

    let selectQuery, updateQuery, data;

    if (status === 1) {
        updateQuery = "UPDATE `to_do_list` SET `status`= ?, `accepted_by`= ?, `accepted_at`= CURRENT_TIMESTAMP WHERE `id`= ?";
        data = [status, username, id];
    } else if (status === 2) {
        selectQuery = "SELECT `complete_comments` FROM `to_do_list` WHERE `id`= ?";
        updateQuery = "UPDATE `to_do_list` SET `status`= ?, `complete_at`= CURRENT_TIMESTAMP, `complete_comments` = ? WHERE `id`= ?";
        data = [status, comment, id];
    } else if (status === 3) {
        selectQuery = "SELECT `reopen_comments` FROM `to_do_list` WHERE `id`= ?";
        updateQuery = "UPDATE `to_do_list` SET `status`= ?, `reopen_by`= ?, `reopen_at`= CURRENT_TIMESTAMP, `reopen_comments` = ? WHERE `id`= ?";
        data = [status, username, comment, id];
    } else if (status === 4) {
        selectQuery = "SELECT `done_comments` FROM `to_do_list` WHERE `id`= ?";
        updateQuery = "UPDATE `to_do_list` SET `status`= ?, `done_by`= ?, `done_at`= CURRENT_TIMESTAMP, `done_comments` = ? WHERE `id`= ?";
        data = [status, username, comment, id];
    }

    if (status === 1) {
        conn.query(updateQuery, data, (err, result) => {
            let response = { status: 0, data: {}, message: '' };
            if (err) {
                response.message = "Something went wrong while updating the task: " + err;
                return res.send(response);
            }

            response.status = 1;
            response.message = "Task updated successfully";
            res.send(response);
        });
    } else {

        conn.query(selectQuery, [id], (err, rows) => {
            let response = { status: 0, data: {}, message: '' };
            if (err) {
                response.message = "Something went wrong while fetching the task data: " + err;
                return res.send(response);
            }
            let existingData = rows[0] ? Object.values(rows[0])[0] : '';


            let newData;

            if (status === 2) {
                newData = existingData ? `${existingData} ---  ${comment}` : comment;
                data[1] = newData;
            }

            if (status === 3 || status === 4) {
                newData = existingData ? `${existingData} --- ${comment}` : comment;
                data[2] = newData;
            }

            conn.query(updateQuery, data, (err, result) => {
                if (err) {
                    response.message = "Something went wrong while updating the task: " + err;
                    return res.send(response);
                }
                response.status = 1;
                response.message = "Task updated successfully";
                res.send(response);
            });
        });
    }
});





export default router;