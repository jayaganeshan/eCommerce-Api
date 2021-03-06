import { Router } from "express";
import auth from "../middleware/auth";
import { userController } from "../controllers/user.controller";
import { User } from "../models/User";
import { ValidateChangePassword, validateEmail, ValidateLogin, validateRegister, ValidateShippingAddress } from "../middleware/validation/userValidation";
import { all, onlyAdmin, Seller_Buyer_Both } from "../services/Roles";
import { validateOrderIdToken } from "../middleware/validation/paramsValaditor";

export const router: Router = Router();
//Creating new User
router.post("/register", validateRegister, userController.register);

//Login
router.post("/login", ValidateLogin, userController.login);
//Change Password
router.post("/change-password", ValidateChangePassword, auth(all), userController.changePassword);
//get all users
router.get("/user/all", auth(onlyAdmin), userController.findAll);
//adding shipping address
router.patch("/update/shipping", ValidateShippingAddress, auth(Seller_Buyer_Both), userController.shippingUpdate);
//start password reset
router.post("/password-reset", validateEmail, userController.startResetPassword);
//end password reset
router.post("/password-reset/:order_id/:token", validateOrderIdToken, userController.endResetPassword);
