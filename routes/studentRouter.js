import express from 'express';
import { createStudent, getStudent } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.get("/", getStudent)

studentRouter.post("/", createStudent)

export default studentRouter