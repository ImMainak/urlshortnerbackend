// ################################ Repositories ################################ //
import * as URLRepositories from '../repositories/urlRepo.js';

// ################################ Response Messages ################################ //
import responseMessages from '../ResponseMessages.js';

import QRCode from 'qrcode';

/*
|------------------------------------------------ 
| API name          :  webHome
| Response          :  Respective response message in JSON format
| Logic             :  Render Home Page
| Request URL       :  BASE_URL/web/home
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const webHome = (req, res) => {
    (async () => {
        let purpose = "Render Home Page";
        try {
            if (!req?.cookies?.access_token)
                res.redirect('/web/login');
            else {
                let userID = req.headers.userID;
                let query = req.query;
                let where = {
                    userID: userID
                }

                if (query.search)
                    where.originalURL = { $regex: '.*' + query.search + '.*', $options: 'i' };
                
                let urlList = await URLRepositories.find(where);

                urlList.forEach(element => {
                    if (element.shortURL)
                        element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
                })

                return res.render('index', {
                    urls: urlList,
                    location: 'home',
                    loggedIN: (req?.cookies?.access_token) ? true : false
                });
            }
        }
        catch (err) {
            console.log("Render Home Page Error : ", err);
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
| API name          :  webAbout
| Response          :  Respective response message in JSON format
| Logic             :  Render About Page
| Request URL       :  BASE_URL/web/about
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const webAbout = (req, res) => {
    (async () => {
        let purpose = "Render About Page";
        try {
            let urlList = await URLRepositories.find();

            urlList.forEach(element => {
                element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
            })

            return res.render('index', {
                location: 'about',
                loggedIN: (req?.cookies?.access_token) ? true : false
            });
        }
        catch (err) {
            console.log("Render About Page Error : ", err);
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
| API name          :  webLogin
| Response          :  Respective response message in JSON format
| Logic             :  Render Login Page
| Request URL       :  BASE_URL/web/login
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const webLogin = (req, res) => {
    (async () => {
        let purpose = "Render Login Page";
        try {
            if (req?.cookies?.access_token)
                res.redirect('/web/home');
            else {
                let urlList = await URLRepositories.find();

                urlList.forEach(element => {
                    element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
                })

                return res.render('index', {
                    location: 'login',
                    loggedIN: (req?.cookies?.access_token) ? true : false
                });
            }
        }
        catch (err) {
            console.log("Render Login Page Error : ", err);
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
| API name          :  webSignUp
| Response          :  Respective response message in JSON format
| Logic             :  Render Signup Page
| Request URL       :  BASE_URL/web/signup
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const webSignUp = (req, res) => {
    (async () => {
        let purpose = "Render Signup Page";
        try {
            if (req?.cookies?.access_token)
                res.redirect('/web/home');
            else {
                let urlList = await URLRepositories.find();

                urlList.forEach(element => {
                    element.shortURL = process.env.HOST_URL + '/' + element.shortURL;
                })

                return res.render('index', {
                    location: 'signup',
                    loggedIN: (req?.cookies?.access_token) ? true : false
                });
            }
        }
        catch (err) {
            console.log("Render Signup Page Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}