import express from 'express';
const router = express.Router();

/* ############################################ Middlewares ############################################ */
import * as AuthenticationMiddlewares from '../middlewares/AuthenticationMiddleware.js';

/* ############################################ Controllers ############################################ */
import * as WebsiteController from '../controllers/websiteController.js';

/* ############################################ URL ############################################ */
router.get("/home", AuthenticationMiddlewares.authenticateRequestAPI, WebsiteController.webHome); // Home Page
router.get("/about", WebsiteController.webAbout); // About Page
router.get("/login", WebsiteController.webLogin); // Login
router.get("/signup", WebsiteController.webSignUp); // Signup

export default router