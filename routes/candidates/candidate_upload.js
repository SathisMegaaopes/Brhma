import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import cors from 'cors';
import conn from "../../sql.js";



const router = express.Router();
router.use(express.json())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

router.use(cors())

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const links = { a: '', b: '' }

const fileUpload = (req, res, next) => {


    const type = req.body.type;
    const id = req.body.id;
    const file = req.file;


    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2);

    const baseDirectory = path.join(__dirname, 'Uploads')
    const yearFolder = path.join(baseDirectory, currentYear)
    const monthFolder = path.join(yearFolder, currentMonth)
    const fileFolder = path.join(monthFolder, 'ResumeFolder')
    const imagesFolder = path.join(monthFolder, 'ProfileFolder')

    if (!file) {
        return res.send(400).send('No file is received')
    }

    let targetDirectory;
    let relativePath;


    fs.access(baseDirectory, fs.constants.F_OK, (baseErr) => {
        if (baseErr) {
            fs.mkdir(baseDirectory, { recursive: true }, (err) => {
                if (err) {
                    return res.status(500).json({ error: `Failed to create Basefolder (ie) ${baseDirectory}` })
                }
            })
        }
        fs.access(yearFolder, fs.constants.F_OK, (yearErr) => {
            if (yearErr) {
                fs.mkdir(yearFolder, { recursive: true }, (err) => {
                    if (err) {
                        return res.status(500).json({ error: `Failed to create year folder ${currentYear}.` });
                    }
                });
            }
            fs.access(monthFolder, fs.constants.F_OK, (monthErr) => {
                if (monthErr) {
                    fs.mkdir(monthFolder, { recursive: true }, (err) => {
                        if (err) {
                            return res.status(500).json({ error: `Failed to create month folder ${currentMonth}.` });
                        }
                    });
                }

                if (type === 'file') {
                    fs.access(fileFolder, fs.constants.F_OK, (folderErr) => {
                        if (folderErr) {
                            fs.mkdir(fileFolder, { recursive: true }, (err) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Failed to create resume folder.' });
                                }

                                const yearMonthFilePath = path.join(fileFolder);
                                targetDirectory = yearMonthFilePath

                                const a = 0;
                                fileUploading(a)

                            });
                        } else {
                            const yearMonthFilePath = path.join(fileFolder);
                            targetDirectory = yearMonthFilePath

                            const a = 0;
                            fileUploading(a)
                        }
                    });

                    
                } else if (type === 'image') {
                    fs.access(imagesFolder, fs.constants.F_OK, (folderErr) => {
                        if (folderErr) {
                            fs.mkdir(imagesFolder, { recursive: true }, (err) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Failed to create profile folder.' });
                                }

                                const yearMonthImagePath = path.join(imagesFolder);
                                targetDirectory = yearMonthImagePath

                                const b = 1;
                                fileUploading(b)

                            });
                        } else {
                            const yearMonthImagePath = path.join(imagesFolder);
                            targetDirectory = yearMonthImagePath

                            const b = 1;
                            fileUploading(b)
                        }
                    });
                } else {
                    res.status(400).json({ error: 'The file format is not acceptable.' });

                }
            });
        });
    })


    function fileUploading(value) {
        const targetPath = path.join(targetDirectory, `${id}_${file.originalname}`);

        const relativePath = path.relative(__dirname, targetPath);

        fs.writeFile(targetPath, file.buffer, (err) => {
            if (err) {
                return next(err);
            }
            if (value === 0) {
                const sql_query = "UPDATE `candidate_master` SET `round_1_at` = NULL, `round_2_at` = NULL, `round_3_at` = NULL, `round_4_at` = NULL, `round_5_at` = NULL, `round_6_at` = NULL,`resume` = ? WHERE `candidate_id` = ? ";

                conn.query(sql_query, [relativePath, id],
                    (err, rows) => {
                        let response = { status: 0, data: [], message: "" };
                        if (!err) {
                            response.message = "Resume Details Updated!!!";
                            res.send(response);
                            next()
                        }
                        else {
                            response.status = 1;
                            response.message = "Something Went Wrong!!! " + JSON.stringify(err);
                            res.send(response);

                        }
                    }
                )


            } else if (value === 1) {

                const sql_query = "UPDATE `candidate_master` SET `round_1_at` = NULL, `round_2_at` = NULL, `round_3_at` = NULL, `round_4_at` = NULL, `round_5_at` = NULL, `round_6_at` = NULL,`profile` = ? WHERE `candidate_id` = ? ";

                conn.query(sql_query, [relativePath, id],
                    (err, rows) => {
                        let response = { status: 0, data: [], message: "" };
                        if (!err) {
                            response.message = "Resume Details Updated!!!";
                            res.send(response);
                            next()

                        }
                        else {
                            response.status = 1;
                            response.message = "Something Went Wrong!!! " + JSON.stringify(err);
                            res.send(response);

                        }
                    }
                )

            }

        });

    }

}



router.post('/', upload.single('file'), fileUpload)


router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

router.get('/:id', (req, res) => {
    const { id } = req.params


    const sql_query = "SELECT `resume`,`profile` FROM `candidate_master` WHERE `candidate_id` = ? ";
    conn.query(sql_query, [id],
        (err, rows) => {
            let response = { status: 0, data: { resume: '', profile: '' }, message: "" };
            if (!err) {
                if (rows.length > 0) {
                    const resumeUrl = rows[0].resume;
                    const profileUrl = rows[0].profile;
                    response.data.resume = resumeUrl;
                    response.data.profile = profileUrl
                    response.message = "Resume URL is fetched";
                } else {
                    response.status = 1;
                    response.message = "No resume URL found for the given candidate ID";
                }
                res.send(response);

            }
            else {
                response.status = 1;
                response.message = "Something Went Wrong!!! " + JSON.stringify(err);
                res.send(response);

            }
        }
    )


})


export default router;
