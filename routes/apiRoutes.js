import express from 'express';
const router = express.Router();

/* ############################################ Middlewares ############################################ */
import * as validateRequest from '../middlewares/ValidateRequest.js';

/* ############################################ Joi Validation Schema ################################## */
import * as URLSchemas from '../validation-schemas/urlSchemas.js';

/* ############################################ Controllers ############################################ */
import * as URLController from '../controllers/urlController.js';

/* ############################################ URL ############################################ */
router.post("/create_url", validateRequest.validate(URLSchemas.urlCreateSchema, 'body'), URLController.urlCreate); // Create URL
router.get("/url_list", URLController.urlList); // Fetch All URL List
router.get("/url_details/:url", URLController.urlDetails); // Fetch URL Details
router.get("/:url", URLController.urlVisit); // Visit URL
router.get("/url_analytics/:url", URLController.urlAnalytics); // Fetch URL Analytics
router.get("/url/home", URLController.urlHome); // Fetch All URL List
router.get("/url/qrcreate", URLController.qrCreate); // Create QR Code
router.get("/url/about", URLController.urlAbout); // Fetch All URL List
router.get("/url/login", URLController.urlLogin); // Fetch All URL List
router.get("/url/signup", URLController.urlSignUp); // Fetch All URL List

export default router