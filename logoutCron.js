import express from 'express';
import cron from 'node-cron';
import mysql from 'mysql';
import dayjs from 'dayjs';


const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'sathis_megaaopes'
})


conn.connect((err) => {

    if (err) {
        console.log("Somethig went wrong" + err)
    } else {
        console.log("Database Connected Successfully.....")
    }

})



function adjustTime(givenTime) {

    const currentTime = dayjs();
    const givenDateTime = dayjs(givenTime);

    const diffInHours = currentTime.diff(givenDateTime, 'hour');

    if (diffInHours > 10) {
        const adjustedTime = givenDateTime.add(10, 'hour').startOf('hour');
        return adjustedTime.format('YYYY-MM-DD HH:mm:ss');
    } else {
        return null
    }
}


function LogoutAutomatically() {

    const fetchData = "SELECT * FROM `emp_activity` WHERE `logout_time` IS NULL ORDER BY `id` DESC;";

    conn.query(fetchData, (err, allData) => {
        if (err) {
            console.log('Error da Nanba' + err)
        } else {

            for (let i = 0; i < allData.length; i++) {

                const login_Time = allData[i]?.login_time;

                const automattedLoggoutTime = adjustTime(login_Time);

                const updateLogoutQuery = "UPDATE `emp_activity` SET `logout_time` = ? WHERE `login_time` LIKE ? "

                const firstOne = dayjs(login_Time)

                const SecondOne = firstOne.format('YYYY-MM-DD HH:mm:ss');

                const dataofLoginTime = `%${SecondOne}`

                conn.query(updateLogoutQuery, [automattedLoggoutTime, dataofLoginTime], (err, rows) => {

                    if (err) {

                        console.log('Error in Updating the Employee Activity ... ' + err)

                    } else {

                        console.log('Data Updated......')

                    }
                })

            }
        }
    })

}




cron.schedule('* * * * *', async () => {
    try {
        console.log('Running LogoutAutomatically function every minute now...');
        LogoutAutomatically();
    } catch (error) {
        console.log('Error running LogoutAutomatically: ' + error);
    }
});



// (async () => {
//     try {
//         LogoutAutomatically();
//     } catch (error) {
//         console.log(error)
//     }
// })()