import express from 'express';
const router = express.Router();

/* ############################################ Middlewares ############################################ */
import * as validateRequest from '../middlewares/ValidateRequest.js';
import * as AuthenticationMiddlewares from '../middlewares/AuthenticationMiddleware.js';

/* ############################################ Joi Validation Schema ################################## */
import * as UserSchemas from '../validation-schemas/userSchemas.js';

/* ############################################ Controllers ############################################ */
import * as UserController from '../controllers/UserController.js';

/* ############################################ URL ############################################ */
router.post("/register", validateRequest.validate(UserSchemas.userCreateSchema, 'body'), UserController.userRegister); // Register User
router.post("/login", validateRequest.validate(UserSchemas.userLoginSchema, 'body'), UserController.userLogin); // User Login
router.put("/resetPassword", validateRequest.validate(UserSchemas.userPasswordResetSchema, 'body'), UserController.resetPassword); // User Password Reset
router.get("/all_user_list", UserController.userList); // Fetch User List
router.get("/user_detail", AuthenticationMiddlewares.authenticateRequestAPI, UserController.userDetail); // Fetch User Details
router.put("/logout", UserController.userLogout); // User Login

export default router