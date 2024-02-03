// ################################ Repositories ################################ //
import * as URLRepositories from '../repositories/urlRepo.js';

// ################################ Response Messages ################################ //
import responseMessages from '../ResponseMessages.js';

import { nanoid } from 'nanoid';
import moment from 'moment';
import QRCode from 'qrcode';

/*
|------------------------------------------------ 
| API name          :  urlCreate
| Response          :  Respective response message in JSON format
| Logic             :  Create Short URL
| Request URL       :  BASE_URL/create_url
| Request method    :  POST
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlCreate = (req, res) => {
    (async () => {
        let purpose = "Create Short URL";
        try {
            let userID = req.headers.userID;
            let body = req.body;
            let urlData = await URLRepositories.findOne({ userID: userID, originalURL: body.originalURL });
            let shortURLList = (await URLRepositories.find()).filter(f => f.shortURL).map(m => m.shortURL);

            let shortURL = nanoid(8);

            while(shortURLList.includes(shortURL)) {
                shortURL = nanoid(8);
            }

            if (urlData) {
                await URLRepositories.updateOne({ _id: urlData._id }, { shortURL: shortURL });
            } else {
                let createData = {
                    userID: userID,
                    shortURL: shortURL,
                    originalURL: body.originalURL
                }
                await URLRepositories.create(createData);
            }

            urlData = await URLRepositories.findOne({ userID: userID, originalURL: body.originalURL });
            urlData.shortURL = process.env.HOST_URL + '/' + urlData.shortURL;

            return res.send({
                status: 200,
                msg: responseMessages.urlCreate,
                data: urlData,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Create Short URL Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  urlList
| Response          :  Respective response message in JSON format
| Logic             :  Find All Short URL List
| Request URL       :  BASE_URL/url_list
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlList = (req, res) => {
    (async () => {
        let purpose = "Find All Short URL List";
        try {
            let userID = req.headers.userID;
            let query = req.query;
            let where = {
                userID: userID
            }

            if (query.search)
                where.originalURL = { $regex: '.*' + query.search + '.*', $options: 'i' };

            let urlList = await URLRepositories.find(where);

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            return res.send({
                status: 200,
                msg: responseMessages.urlList,
                data: urlList,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Find All Short URL List Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  urlDetails
| Response          :  Respective response message in JSON format
| Logic             :  Find Short URL Details
| Request URL       :  BASE_URL/url_details/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlDetails = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Details";
        try {
            let userID = req.headers.userID;
            let url = req.params.url;
            let urlData = await URLRepositories.findOne({ userID: userID, shortURL: url });

            if (!urlData) {
                return res.send({
                    status: 400,
                    msg: responseMessages.urlNotFound,
                    data: {},
                    purpose: purpose
                })
            }
            
            urlData.shortURL = process.env.HOST_URL + '/' + urlData.shortURL;

            return res.send({
                status: 200,
                msg: responseMessages.urlDetails,
                data: urlData,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Find Short URL Details Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  urlVisit
| Response          :  Respective response message in JSON format
| Logic             :  Visit URL
| Request URL       :  BASE_URL/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlVisit = (req, res) => {
    (async () => {
        let purpose = "Visit URL";
        try {
            let url = req.params.url;
            let urlData = await URLRepositories.findOne({ shortURL: url });

            if (!urlData) {
                return res.send({
                    status: 400,
                    msg: responseMessages.urlNotFound,
                    data: {},
                    purpose: purpose
                })
            }
            
            let urlVisitUpdate = await URLRepositories.updateOne({ _id: urlData._id }, { $push: { visitHistory: { timestamp: moment().format() } } });
            
            res.redirect(urlData.originalURL);
        }
        catch (err) {
            console.log("Visit URL Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  urlAnalytics
| Response          :  Respective response message in JSON format
| Logic             :  Find Short URL Analytics
| Request URL       :  BASE_URL/url_analytics/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlAnalytics = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Analytics";
        try {
            let userID = req.headers.userID;
            let url = req.params.url;
            let urlData = await URLRepositories.findOne({ userID: userID, shortURL: url });

            if (!urlData) {
                return res.send({
                    status: 400,
                    msg: responseMessages.urlNotFound,
                    data: {},
                    purpose: purpose
                })
            }

            let retData = {
                totalViews: urlData.visitHistory.length,
                lastView: (urlData.visitHistory.length == 0) ? null : moment(urlData.visitHistory[urlData.visitHistory.length - 1]?.timestamp).format('DD-MM-YYYY hh:mm a')
            }

            return res.send({
                status: 200,
                msg: responseMessages.urlAnalytics,
                data: retData,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Find Short URL Analytics Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  urlAnalytics
| Response          :  Respective response message in JSON format
| Logic             :  Create QR Code
| Request URL       :  BASE_URL/create_qr
| Request method    :  POST
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const qrCreate = (req, res) => {
    (async () => {
        let purpose = "Create QR Code";
        try {
            let userID = req.headers.userID;
            let body = req.body;
            let urlData = await URLRepositories.findOne({ userID: userID, originalURL: body.originalURL });

            let qrCode = await QRCode.toDataURL(urlData?.originalURL ?? body.originalURL, { height: 130, width: 130 }).then((data) => data);
            
            if (urlData) {
                await URLRepositories.updateOne({ _id: urlData._id }, { $set: { qrCode: qrCode } });
            } else {
                let createData = {
                    userID: userID,
                    originalURL: body.originalURL,
                    qrCode: qrCode
                }
                await URLRepositories.create(createData);
            }

            urlData = await URLRepositories.findOne({ userID: userID, originalURL: body.originalURL });
            urlData.shortURL = process.env.HOST_URL + '/' + urlData.shortURL;

            res.send({
                status: 200,
                msg: responseMessages.qrCreate,
                data: urlData,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Create QR Code Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}