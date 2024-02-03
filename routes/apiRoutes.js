import express from 'express';
const router = express.Router();

/* ############################################ Middlewares ############################################ */
import * as validateRequest from '../middlewares/ValidateRequest.js';
import * as AuthenticationMiddlewares from '../middlewares/AuthenticationMiddleware.js';

/* ############################################ Joi Validation Schema ################################## */
import * as URLSchemas from '../validation-schemas/urlSchemas.js';

/* ############################################ Controllers ############################################ */
import * as URLController from '../controllers/urlController.js';

/* ############################################ URL ############################################ */
router.post("/create_url", AuthenticationMiddlewares.authenticateRequestAPI, validateRequest.validate(URLSchemas.urlCreateSchema, 'body'), URLController.urlCreate); // Create URL
router.get("/url_list", AuthenticationMiddlewares.authenticateRequestAPI, URLController.urlList); // Fetch All URL List
router.get("/url_details/:url", AuthenticationMiddlewares.authenticateRequestAPI, URLController.urlDetails); // Fetch URL Details
router.get("/:url", URLController.urlVisit); // Visit URL
router.get("/url_analytics/:url", AuthenticationMiddlewares.authenticateRequestAPI, URLController.urlAnalytics); // Fetch URL Analytics
router.post("/create_qr", AuthenticationMiddlewares.authenticateRequestAPI, validateRequest.validate(URLSchemas.qrCodeCreateSchema, 'body'), URLController.qrCreate); // Create QR Code

export default router