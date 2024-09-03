import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


import candidatesRoutes from "./routes/candidates/candidates.js";
import candidateWorkRoutes from "./routes/candidates/candidate_work.js"
import candidatePersonalRoutes from "./routes/candidates/candidate_personal.js"
import candidateReferRoutes from "./routes/candidates/candidate_refer.js";
import candidateUploads from "./routes/candidates/candidate_upload.js"

import interviewEvaluation from "./routes/interview/evaluation.js";
import typingTest from "./routes/interview/typingTest.js";
import writingTest from "./routes/interview/writingTest.js";
import selected from "./routes/interview/hr_round.js";

import employeeList from "./routes/Employee/employeeList.js";
import Login from "./routes/Login/login.js";
import todolist from "./routes/todolist/todolist.js"

import { fileURLToPath } from 'url';
import path from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());



app.use('/uploads', express.static(path.join(__dirname, 'routes/candidates/Uploads')));


app.use('/candidates', candidatesRoutes);
app.use('/candidatework', candidateWorkRoutes);
app.use('/candidatepersonal', candidatePersonalRoutes);
app.use('/candidaterefer', candidateReferRoutes);
app.use('/interviewevaluation', interviewEvaluation);
app.use('/typingtest', typingTest);
app.use('/writingtest', writingTest);
app.use('/hrround', selected);
app.use('/employeelist', employeeList);
app.use('/login', Login);

app.use('/candidateupload', candidateUploads)

app.use('/todolist',todolist)


app.get('/', (req, res) => {
  res.send(`This is the Bramha portal running on this server ${PORT}`)
})

app.listen(PORT, () => { console.log(`Server is running at the port number ${PORT}`) });


