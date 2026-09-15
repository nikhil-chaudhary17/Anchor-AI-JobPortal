import express from "express";
import { createCompany, deleteCompany, getCompanyById, getMyCompanies, getMyCompany, updateCompany } from "../controllers/companyController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateRequest.js";
import { createCompanySchema } from '../validators/companyValidator.js'

const router = express.Router();


router.post(
  "/create",
  protect,
  authorizeRoles("recruiter", "admin"),
  validate(createCompanySchema),
  createCompany
);

router.get("/my-companies" , protect , authorizeRoles("recruiter") , getMyCompanies);
router.get("/my-company" , protect , authorizeRoles("recruiter") , getMyCompany);
router.get("/:id" , protect , getCompanyById);
router.put("/:id" , protect , authorizeRoles("recruiter") , updateCompany);
router.delete("/:id" , protect , authorizeRoles("recruiter") , deleteCompany);

export default router;