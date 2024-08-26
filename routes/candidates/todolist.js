import express from "express";
import conn from "../../sql.js";

const router = express.Router();


router.get('/', (req, res) => {

    // const sql_query = "SELECT * FROM `to_do_list` WHERE 1;"

    const { id } = req.query;

    const sql_query = "SELECT * FROM `to_do_list` WHERE `created_by`= ? "

    conn.query(sql_query, [id],
        (err, rows) => {
            let response = { status: 0, data: { todolist: '' }, message: '' }
            if (!err) {
                const todolist = rows;
                response.data.todolist = todolist;
                response.status = 1;
                response.message = 'Todo list fetched from the database';
                res.send(response);
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

    console.clear();

    const { formState, tatValue, userID, status } = req.body;

    const name = formState.name;
    const description = formState.description;
    const department = formState.department;
    const team = formState.team;
    const assignee = formState.assignee;


    const sql_query = "INSERT INTO `to_do_list` ( task_name , task_description , task_dept , task_team , task_assignee , status , tat , created_by )  VALUES (?,?,?,?,?,?,?,?)"

    conn.query(sql_query, [name, description, department, team, assignee, status, tatValue, userID], (err, rows) => {
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



export default router;