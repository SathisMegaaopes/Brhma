import mysql from "mysql"

const conn = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    // database:"megaaopes"
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



export default conn;
