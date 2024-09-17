import express from 'express'
import conn from '../../sql.js'
import { getCurrentMonthYear } from '../Utlis/index.js'


const router = express.Router()


router.get('/', (req, res) => {


    const data = {
        coloredDates: {
            '2024-09-12': '#FF0000',
            '2024-09-18': '#008000',
            '2024-09-20': '#808080'
        },
        pointsData: {
            '2024-09-12': ['Event A', 'Meeting'],
            '2024-09-18': ['Holiday', 'Reminder'],
            '2024-09-20': ['Task Deadline', 'Conference']
        }
    };
    res.json(data);


    // const { emp_id } = req.body;

    // const date = getCurrentMonthYear()

    // console.log(date)

    // const query = "SELECT * FROM `emp_activity` WHERE `emp_id` = ? AND `login_time` LIKE ? ORDER BY `login_time` ASC ";

    // conn.query(query, [emp_id, date], (err, rows) => {

    //     let response = { status: 0, data: {}, message: '' };

    //     if (!err) {
    //         response.status = 1;
    //         response.data = rows
    //         response.message = "Employee Activity Getted Successfully..... ";
    //         res.send(response)
    //     } else {
    //         response.message = "Something went wrong in getting employee Activity " + err;
    //         res.send(response)
    //     }
    // })
})



export default router



// app.get('/api/calendarData', (req, res) => {
//     const data = {
//       coloredDates: {
//         '2024-09-12': '#FF0000',
//         '2024-09-18': '#008000',
//         '2024-09-20': '#808080'
//       },
//       pointsData: {
//         '2024-09-12': ['Event A', 'Meeting'],
//         '2024-09-18': ['Holiday', 'Reminder'],
//         '2024-09-20': ['Task Deadline', 'Conference']
//       }
//     };
//     res.json(data);
//   });
