import express from 'express'
import conn from '../../sql.js'
import { getCurrentMonthYear } from '../Utlis/index.js'


const router = express.Router()

function extractDatefromtimestamp(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}


function getMonthDate() {
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const daysToRemoveFromStart = 1;
    const daysToAddAtEnd = 1;

    const adjustedStart = new Date(firstDay);
    adjustedStart.setDate(adjustedStart.getDate() + daysToRemoveFromStart);

    const adjustedEnd = new Date(lastDay);
    adjustedEnd.setDate(adjustedEnd.getDate() + daysToAddAtEnd);

    for (let date = adjustedStart; date <= adjustedEnd; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date).toISOString().split('T')[0]);
    }

    return dates;
}


router.get('/', (req, res) => {

    const { emp_id } = req.query;

    const date = getCurrentMonthYear()

    const todayDate = new Date();

    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    const todayDateFormat = `${year}-${month}-${day}`

    const query = "SELECT * FROM `emp_activity` WHERE `emp_id` = ? AND `login_time` LIKE ? ORDER BY `login_time` ASC ";

    conn.query(query, [emp_id, date], (err, rows) => {

        let response = { status: 0, data: {}, message: '' };

        if (!err) {
            if (rows.length === 0) {
                response.message = "No data available in employee activity... "
                res.send(response)
            } else {
                const allData = rows.map((item) => {

                    const login_time = item.login_time;
                    const logout_time = item.logout_time;
                    let color;
                    let formattedTime;

                    const date = extractDatefromtimestamp(login_time)

                    const todayMapDate = new Date(item.login_time)
                    const year = todayMapDate.getFullYear();
                    const month = String(todayMapDate.getMonth() + 1).padStart(2, '0');
                    const day = String(todayMapDate.getDate()).padStart(2, '0');
                    const todayMapDateFormat2 = `${year}-${month}-${day}`

                    
                    if (todayDateFormat === todayMapDateFormat2) {

                        const startDate = new Date(login_time);
                        const endDate = new Date();
                        const difference = endDate - startDate
                        const differenceInSeconds = Math.floor(difference / 1000)
                        const lasthours = Math.floor(differenceInSeconds / 3600)
                        const lastMinutes = Math.floor((differenceInSeconds % 3600) / 60)
                        const lastSeconds = differenceInSeconds % 60;

                        formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastMinutes).padStart(2, '0')}:${String(lastSeconds).padStart(2, '0')}`
                        color = 'none'
                    }
                    else if (login_time && logout_time) {

                        const startDate = new Date(login_time);
                        const endDate = new Date(logout_time);
                        const difference = endDate - startDate
                        const differenceInSeconds = Math.floor(difference / 1000)
                        const lasthours = Math.floor(differenceInSeconds / 3600)
                        const lastMinutes = Math.floor((differenceInSeconds % 3600) / 60)
                        const lastSeconds = differenceInSeconds % 60;

                        formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastMinutes).padStart(2, '0')}:${String(lastSeconds).padStart(2, '0')}`

                        if (lasthours >= 9) {
                            color = '#43a047'
                        } else if (lasthours < 9) {
                            color = '#f44336'
                        }


                    }
                    return {
                        "date": date,
                        "color": color,
                        "content": `Logged Hours : ${formattedTime}`,
                    }

                })

                const myNeeds = getMonthDate()
                const recordsMap = new Map(allData.map(item => [item.date, item]));
                const finalResults = myNeeds.map(date => {
                    const record = recordsMap.get(date);

                    if (record) {
                        return {
                            date: date,
                            color: record.color,
                            content: record.content,
                        }
                    } else {
                        return {
                            date: date,
                            color: "#c4dad2",
                            content: null
                        }
                    }
                })

                response.status = 1;
                response.data = finalResults;
                response.message = "Employee Activity Getted Successfully..... ";
                res.send(response)
            }
        } else {
            response.message = "Something went wrong in getting employee Activity " + err;
            res.send(response)
        }
    })
})



export default router



                    // else if (login_time && !logout_time) {

                    //     const startDate = new Date(login_time);
                    //     const endDate = new Date();
                    //     const difference = endDate - startDate
                    //     const differenceInSeconds = Math.floor(difference / 1000)
                    //     const lasthours = Math.floor(differenceInSeconds / 3600)
                    //     const lastMinutes = Math.floor((differenceInSeconds % 3600) / 60)
                    //     const lastSeconds = differenceInSeconds % 60;

                    //     formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastMinutes).padStart(2, '0')}:${String(lastSeconds).padStart(2, '0')}`

                    //     // color = '#00b0ff'
                    // }