import express from 'express'
import { deleteUser, getAllUsers, getStats, getUserById, updateUserStatus } from '../controllers/adminController.js';
import { updateStatusSchema } from '../validators/adminValidator.js';
import { validate } from "../middlewares/validateRequest.js";


const router = express.Router();

router.get("/users",getAllUsers);
router.get("/users/:id",getUserById);
router.put("/users/:id/status" ,validate(updateStatusSchema) , updateUserStatus)
router.delete("/users/:id", deleteUser);
router.get("/stats", getStats);

export default router;