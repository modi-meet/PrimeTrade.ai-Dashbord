import express from 'express';
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

export default router;
