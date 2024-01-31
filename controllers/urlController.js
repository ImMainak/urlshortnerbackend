// ################################ Repositories ################################ //
import * as URLRepositories from '../repositories/urlRepo.js';

// ################################ Response Messages ################################ //
import responseMessages from '../ResponseMessages.js';

import { nanoid } from 'nanoid';
import moment from 'moment';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var QRCode = require('qrcode');

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
            let body = req.body;
            let shortURL = nanoid(8);
            let createData = {
                shortURL: shortURL,
                originalURL: body.originalURL
            }
            let urlCreate = await URLRepositories.create(createData);

            urlCreate.shortURL = process.env.HOST_URL + '/' + urlCreate.shortURL;

            return res.send({
                status: 200,
                msg: responseMessages.urlCreate,
                data: urlCreate,
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
            let urlList = await URLRepositories.find();

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
| API name          :  urlHome
| Response          :  Respective response message in JSON format
| Logic             :  Find Short URL Analytics
| Request URL       :  BASE_URL/url_analytics/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlHome = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Analytics";
        try {
            let urlList = await URLRepositories.find();

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            return res.render('index', {
                urls: urlList,
                location: 'home'
            });
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
| Logic             :  Find Short URL Analytics
| Request URL       :  BASE_URL/url_analytics/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const qrCreate = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Analytics";
        try {
            let urlList = await URLRepositories.find();

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            QRCode.toFile('qrCode.png',urlList[0].shortURL, (err, data) => {
                if (err)
                    return console.log("Error");
                console.log(data);
            })

            res.send({
                status: 200,
                data: {},
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
| API name          :  urlAbout
| Response          :  Respective response message in JSON format
| Logic             :  Find Short URL Analytics
| Request URL       :  BASE_URL/url_analytics/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlAbout = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Analytics";
        try {
            let urlList = await URLRepositories.find();

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            return res.render('index', {
                location: 'about'
            });
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
| API name          :  urlLogin
| Response          :  Respective response message in JSON format
| Logic             :  Find Short URL Analytics
| Request URL       :  BASE_URL/url_analytics/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlLogin = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Analytics";
        try {
            let urlList = await URLRepositories.find();

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            return res.render('index', {
                location: 'login'
            });
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
| API name          :  urlSignUp
| Response          :  Respective response message in JSON format
| Logic             :  Find Short URL Analytics
| Request URL       :  BASE_URL/url_analytics/:url
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const urlSignUp = (req, res) => {
    (async () => {
        let purpose = "Find Short URL Analytics";
        try {
            let urlList = await URLRepositories.find();

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            return res.render('index', {
                location: 'signup'
            });
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