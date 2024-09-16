import express from 'express'
import conn from '../../sql.js'
import { getTodayDate } from '../Utlis/index.js'

const router = express.Router()


function CalculateTimeDifference(date1, date2) {
    const startDate = new Date(date1)
    const endDate = new Date(date2)

    const difference = endDate - startDate

    const differenceInSeconds = Math.floor(difference / 1000)

    return differenceInSeconds
}


function HoursIntoValue(totalHoursSpent) {

    const lasthours = Math.floor(totalHoursSpent / 3600);
    const lastminutes = Math.floor((totalHoursSpent % 3600) / 60);

    const formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastminutes).padStart(2, '0')}`;

    return formattedTime
}


function HoursintoFormat(totalHoursSpent) {
    const lasthours = Math.floor(totalHoursSpent / 3600);
    const lastminutes = Math.floor((totalHoursSpent % 3600) / 60);
    const lastseconds = totalHoursSpent % 60;

    const formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastminutes).padStart(2, '0')}:${String(lastseconds).padStart(2, '0')}`;

    return formattedTime;

}



function StringtoSeconds(str) {
    const [hours, minutes] = str.split(':').map(Number);

    const totalSeconds = hours * 3600 + minutes * 60;

    return totalSeconds;
}



router.put('/', (req, res) => {

    const { breakType, emp_id, breakEnd } = req.body

    const date = getTodayDate()

    let break_name;

    // let query;

    if (breakType === 1) {
        if (breakEnd === 0) {
            break_name = "break_1_start";
        } else {
            break_name = "break_1_end"
        }
    } else if (breakType === 2) {
        if (breakEnd === 0) {
            break_name = "break_2_start";
        } else {
            break_name = "break_2_end"
        }
    } else if (breakType === 3) {
        if (breakEnd === 0) {
            break_name = "break_3_start";
        } else {
            break_name = "break_3_end"
        }
    } else if (breakType === 4) {
        if (breakEnd === 0) {
            break_name = "meeting_start";
        } else {
            break_name = "meeting_end"
        }
    } else if (breakType === 5) {
        if (breakEnd === 0) {
            break_name = "feedback_start";
        } else {
            break_name = "feedback_end"
        }
    }

    let query = `UPDATE emp_activity SET \`${break_name}\` = CURRENT_TIMESTAMP WHERE emp_id = ? AND login_time LIKE ?`;

    conn.query(query, [emp_id, date], (err, rows) => {
        let response = {
            status: 0,
            data: {
                break1End: 0,
                break2End: 0,
                break3End: 0,
            },
            message: ''
        };
        if (!err) {

            const anotherQuery = " SELECT * FROM `emp_activity` WHERE emp_id = ? AND login_time LIKE ?  "

            conn.query(anotherQuery, [emp_id, date], (err, rows) => {

                if (!err) {

                    response.data.break1End = Boolean(rows[0].break_1_end) ? 1 : response.data.break1End;
                    response.data.break2End = Boolean(rows[0].break_2_end) ? 1 : response.data.break2End;
                    response.data.break3End = Boolean(rows[0].break_3_end) ? 1 : response.data.break3End;


                    // if (breakType === 4 && breakEnd === 1) {
                    if (breakType === 4 && breakEnd === 1 && rows[0].meeting_start !== null && rows[0].meeting_end !== null) {
                        if (rows[0].meeting_end !== null) {
                            const meeting_start = rows[0].meeting_start;
                            const meeting_end = rows[0].meeting_end;

                            const meetings_time = rows[0].meeting_spent;

                            const [hours, minutes,seconds] = meetings_time.split(":").map(Number);

                            const firsttotalHours = hours * 3600 + minutes * 60 + seconds

                            const difference = CalculateTimeDifference(meeting_start, meeting_end)

                            const totalHoursSpent = firsttotalHours + difference

                            const lasthours = Math.floor(totalHoursSpent / 3600);
                            const lastminutes = Math.floor((totalHoursSpent % 3600) / 60);
                            const lastseconds = totalHoursSpent % 60;

                            const formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastminutes).padStart(2, '0')}:${String(lastseconds).padStart(2, '0')}`;

                            const anotherQuery = "UPDATE `emp_activity` SET `meeting_spent` = ? , `meeting_start` = NULL , `meeting_end` = NULL WHERE emp_id = ? AND login_time LIKE ? ";

                            conn.query(anotherQuery, [formattedTime, emp_id, date], (err, rows) => {
                                if (!err) {
                                    response.status = 1
                                    response.message = "Success ...... ";
                                    res.send(response)

                                } else {
                                    response.message = "Something went wrong in Updating the Total Meeting Time " + err;
                                    res.send(response)
                                }
                            })



                        }
                    } else if (breakType === 5 && breakEnd === 1) {
                        if (rows[0].feedback_end !== null) {
                            const feedback_start = rows[0].feedback_start;

                            const feedback_end = rows[0].feedback_end;

                            const feedback_time = rows[0].feedback_spent;

                            const [hours, minutes, seconds] = feedback_time.split(":").map(Number);

                            const firsttotalHours = hours * 3600 + minutes * 60 + seconds

                            const difference = CalculateTimeDifference(feedback_start, feedback_end)

                            const totalHoursSpent = firsttotalHours + difference

                            const lasthours = Math.floor(totalHoursSpent / 3600);
                            const lastminutes = Math.floor((totalHoursSpent % 3600) / 60);
                            const lastseconds = totalHoursSpent % 60;

                            const formattedTime = `${String(lasthours).padStart(2, '0')}:${String(lastminutes).padStart(2, '0')}:${String(lastseconds).padStart(2, '0')}`;

                            const anotherQuery = "UPDATE `emp_activity` SET `feedback_spent` = ? , `feedback_start` = NULL , `feedback_end` = NULL WHERE emp_id = ? AND login_time LIKE ? ";

                            conn.query(anotherQuery, [formattedTime, emp_id, date], (err, rows) => {
                                if (!err) {
                                    response.status = 1
                                    response.message = "Success !...... ";
                                    res.send(response)
                                } else {
                                    response.message = "Something went wrong in Updating the Total Meeting Time " + err;
                                    res.send(response)
                                }
                            })


                        }
                    } else {
                        response.message = "Something went wrong in Selecting the completed breaks " + err;
                        res.send(response)
                    }


                } else {
                    response.message = "Something went wrong in Selecting the completed breaks " + err;
                    res.send(response)
                }
            })

        } else {

            response.message = "Something went wrong in the updating the break time " + err;
            res.send(response)

        }
    })

})



router.get('/', (req, res) => {

    const { id } = req.query;

    const date = getTodayDate()

    const query = "SELECT * FROM `emp_activity` WHERE emp_id = ? AND login_time LIKE ?  "


    conn.query(query, [id, date], (err, rows) => {


        let response = {
            status: 0,
            data: {
                loggedhours: null,
                nonproductivehours: null,
                firstBreak: null,
                secondBreak: null,
                thirdBreak: null,
                meetingBreak: null,
                feedbackBreak: null,
            },
            breakStatus: {

            },
            breakMasterData: {

            },
            message: ''
        };


        if (!err) {


            if (rows.length !== 0) {
                let firstBreak = 0;
                let secondBreak = 0;
                let thirdBreak = 0;

                let totalLogin = 0


                if (rows[0].break_1_start !== null && rows[0].break_1_end !== null) {
                    const difference = CalculateTimeDifference(rows[0].break_1_start, rows[0].break_1_end)
                    firstBreak = difference;
                }

                if ((rows[0].break_2_start !== null && rows[0].break_2_end !== null)) {
                    const difference = CalculateTimeDifference(rows[0].break_2_start, rows[0].break_2_end)
                    secondBreak = difference;
                }

                if ((rows[0].break_3_start !== null && rows[0].break_3_end !== null)) {
                    const difference = CalculateTimeDifference(rows[0].break_3_start, rows[0].break_3_end)
                    thirdBreak = difference;
                }


                if (rows[0].login_time !== null) {
                    const date = new Date()

                    const difference = CalculateTimeDifference(rows[0].login_time, date)

                    totalLogin = difference;
                }

                const totalBreakTime = firstBreak + secondBreak + thirdBreak



                const finalBreak = HoursIntoValue(totalBreakTime)

                // const finalLoginTime = HoursIntoValue(totalLogin)

                // const finalLoginTime2 = HoursintoFormat(finalBreak)



                const nonproductive = totalLogin - totalBreakTime

                const finalNonProductive = HoursIntoValue(nonproductive)




                const meetingspentTime = rows[0].meeting_spent;

                const meetingTotal = StringtoSeconds(meetingspentTime)

                const feedbackspentTime = rows[0].feedback_spent;

                const feedbackTotal = StringtoSeconds(feedbackspentTime)

                const totalMeeting = meetingTotal + feedbackTotal;

                const finalMeetingTotal = HoursIntoValue(totalMeeting)


                // response.data.breaktime = finalBreak;
                // response.data.loggedhours = finalLoginTime
                // response.data.nonproductivehours = finalNonProductive
                // response.data.nonproductivehours = '00:00'
                // response.data.meetingfeedback = finalMeetingTotal

                const break_masterQuery = "SELECT * FROM `break_master`"

                conn.query(break_masterQuery, (err, rows2) => {
                    if (err) {
                        response.message = "Something went wrong in Break_master fetching .... " + err;
                        res.send(response)
                    } else {
                        if (rows2.length !== 0) {

                            const breakStatus = [
                                { name: '15 mins break 1', start: rows[0].break_1_start, end: rows[0].break_1_end, type: 1 },
                                { name: '15 mins break 2', start: rows[0].break_2_start, end: rows[0].break_2_end, type: 2 },
                                { name: '30 mins break', start: rows[0].break_3_start, end: rows[0].break_3_end, type: 3 },
                                { name: 'Meeting', start: rows[0].meeting_start, end: rows[0].meeting_end, type: 4 },
                                { name: 'Feedback', start: rows[0].feedback_start, end: rows[0].feedback_end, type: 5 },
                            ].map((item) => {
                                const { name, start, end, type } = item;

                                let status;
                                if (start && end) {
                                    status = 2;
                                } else if (start && !end) {
                                    status = 1;
                                } else {
                                    status = 0;
                                }

                                return {
                                    breakName: name,
                                    status: status,
                                    type: type

                                }
                            })


                            response.breakStatus = breakStatus;
                            response.breakMasterData = rows2;
                            response.data.loggedhours = HoursintoFormat(totalLogin);
                            response.data.firstBreak = HoursintoFormat(firstBreak);
                            response.data.secondBreak = HoursintoFormat(secondBreak);
                            response.data.thirdBreak = HoursintoFormat(thirdBreak);
                            response.data.nonproductivehours = "00:00:00";
                            response.data.meetingBreak = meetingspentTime;
                            response.data.feedbackBreak = feedbackspentTime;

                            response.status = 1;
                            response.message = "Daily timeFrame data fetched Successfully....."
                            res.send(response)
                        } else {
                            response.message = " No data available in the Break_master table " + err;
                            res.send(response)
                        }
                    }
                })

            } else {
                response.message = "No data available"
                res.send(response)
            }



        } else {
            response.message = "Something went wrong in getting breaks " + err;
            res.send(response)
        }
    })

})

export default router;








//Important queries bro ---- "SELECT * 
// FROM `emp_activity` 
// WHERE `emp_id` = 18001
// AND `login_time` BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') 
// AND LAST_DAY(NOW());
// "


//import Query2 
// SELECT * FROM `emp_activity` WHERE `emp_id` = 18001 AND `login_time` BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE());
