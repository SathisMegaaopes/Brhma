import mysql from "mysql";
import ExcelJS from 'exceljs';
import fs from 'fs';


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


async function gettinghrMonthDetails() {
    const query1 = `SELECT * FROM candidate_master WHERE reg_date LIKE '%2024-07%'`;

    return new Promise((resolve, reject) => {
        conn.query(query1, async (err, results) => {
            if (err) {
                return reject(err);
            } else {

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('HR Month Details');

                worksheet.columns = [
                    { header: 'ID', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'TotalRegistration', key: 'TotalRegistration', width: 30 },
                    { header: 'NoOfPending', key: 'noofPending', width: 15 },
                ];

                const DilipDetails = results.filter((item) => item.created_by === '19877');
                const SapnaDetails = results.filter((item) => item.created_by === '19875');
                const SeemaDetails = results.filter((item) => item.created_by === '18734');
                const PujaDetails = results.filter((item) => item.created_by === '19932');

                const noOfPending = (arr) => arr.filter((item) => item.status === 0);

                const dilipPending = noOfPending(DilipDetails);
                const seemaPending = noOfPending(SeemaDetails);
                const sapnaPending = noOfPending(SapnaDetails);
                const pujaPending = noOfPending(PujaDetails);

                const data = [
                    { id: 1, name: 'Dilip', TotalRegistration: DilipDetails.length, noofPending: dilipPending.length },
                    { id: 2, name: 'Sapna', TotalRegistration: SapnaDetails.length, noofPending: sapnaPending.length },
                    { id: 3, name: 'Pooja', TotalRegistration: PujaDetails.length, noofPending: pujaPending.length },
                    { id: 4, name: 'Seema', TotalRegistration: SeemaDetails.length, noofPending: seemaPending.length }
                ];

                data.forEach((row) => {
                    worksheet.addRow(row);
                });

                try {
                    const excelBuffer = await workbook.xlsx.writeBuffer();
                    resolve(excelBuffer);
                    conn.end()
                } catch (excelError) {
                    reject(excelError);
                }
            }
        });
    });
}


(async () => {
    gettinghrMonthDetails()
        .then((excelBuffer) => {
            console.log('Excel file generated successfully!');
            fs.writeFileSync('hrMonthDetails.xlsx', excelBuffer);
        })
        .catch((error) => {
            console.error('Error generating Excel file:', error);
        })
})()



