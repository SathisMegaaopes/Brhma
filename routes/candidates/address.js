import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import cors from 'cors';
import conn from "../../sql.js";  // connection for the sql query
import axios from 'axios'



const router = express.Router();
router.use(express.json())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

router.use(cors())




router.get('/', async(req,res)=>{
    const personal_url = "https://api.postalpincode.in/pincode/560043";
    try {
        const response = await axios.get(personal_url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
})

export default router;