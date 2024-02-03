// ################################ Repositories ################################ //
import * as UserRepositories from '../repositories/userRepo.js';

// ################################ Response Messages ################################ //
import responseMessages from '../ResponseMessages.js';

// ################################ NPM Packages ################################ //
import md5 from 'md5';
import jwt from 'jsonwebtoken';

// ################################ Globals ################################ //
// const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
// const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;

/*
|------------------------------------------------ 
| API name          :  userRegister
| Response          :  Respective response message in JSON format
| Logic             :  User Registration
| Request URL       :  BASE_URL/user/register
| Request method    :  POST
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const userRegister = (req, res) => {
    (async () => {
        let purpose = "User Registration";
        try {
            let body = req.body;
            const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
            const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;

            let userData = await UserRepositories.findOne({ email: body.email });

            if (!userData) {
                let createData = {
                    name: body.name,
                    email: body.email.toLowerCase(),
                    password: md5(body.password)
                }

                let createResponse = await UserRepositories.create(createData);

                delete createResponse.password;
                let accessToken = jwt.sign({ user_id: createResponse._id, email: createResponse.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken = jwt.sign({ user_id: createResponse._id, email: createResponse.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                createResponse['access_token'] = accessToken;
                createResponse['refresh_token'] = refreshToken;

                if (/postman/ig.test(req.headers['user-agent'])) {
                    res.cookie('access_token', accessToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('refresh_token', refreshToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('myCookieExpiry', Date.now() + global.constants.cookieMaxAge, { maxAge: global.constants.cookieMaxAge });
                    return res.send({
                        status: 200,
                        msg: responseMessages.registrationSuccess,
                        data: createResponse,
                        purpose: purpose
                    })
                } else {
                    res.cookie('access_token', accessToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('refresh_token', refreshToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('myCookieExpiry', Date.now() + global.constants.cookieMaxAge, { maxAge: global.constants.cookieMaxAge });
                    res.redirect('/web/home');
                }
            }
            else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateEmail,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch (err) {
            console.log("User Registration Error : ", err);
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
| API name          :  userLogin
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/user/login
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
export const userLogin = (req, res) => {
    (async () => {
        let purpose = "User Login";
        try {
            let body = req.body;

            let whereData = {
                email: body.email,
                password: md5(body.password)
            }
            let userData = await UserRepositories.findOne(whereData);

            if (userData) {
                let jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
                let jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;
                let accessToken = jwt.sign({ user_id: userData._id, email: userData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken = jwt.sign({ user_id: userData._id, email: userData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                delete userData.password;

                userData['access_token'] = accessToken;
                userData['refresh_token'] = refreshToken;

                if (/postman/ig.test(req.headers['user-agent'])) {
                    res.cookie('access_token', accessToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('refresh_token', refreshToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('myCookieExpiry', Date.now() + global.constants.cookieMaxAge, { maxAge: global.constants.cookieMaxAge });
                    return res.send({
                        status: 200,
                        msg: responseMessages.loginSuccess,
                        data: userData,
                        purpose: purpose
                    })
                } else {
                    res.cookie('access_token', accessToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('refresh_token', refreshToken, { maxAge: global.constants.cookieMaxAge });
                    res.cookie('myCookieExpiry', Date.now() + global.constants.cookieMaxAge, { maxAge: global.constants.cookieMaxAge });
                    res.redirect('/web/home');
                }
            } else {
                return res.send({
                    status: 403,
                    msg: responseMessages.invalidCreds,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("User Login ERROR : ", e);
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
| API name          :  resetPassword
| Response          :  Respective response message in JSON format
| Logic             :  RESET PASSWORD
| Request URL       :  BASE_URL/user/resetPassword
| Request method    :  PUT
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const resetPassword = (req, res) => {
    (async () => {
        let purpose = "Reset Password";
        try {
            let body = req.body;
            let userDetails = await UserRepositories.findOne({ email: body.email });

            if (userDetails) {
                let updateUser = await UserRepositories.updateMany({ _id: userDetails._id }, { password: md5(body.password) });

                if (updateUser[0] != 0) {
                    return res.send({
                        status: 200,
                        msg: responseMessages.passwordreset,
                        data: {},
                        purpose: purpose
                    })
                } else {
                    return res.send({
                        status: 500,
                        msg: responseMessages.resetunable,
                        data: {},
                        purpose: purpose
                    })
                }
            } else {
                return res.send({
                    status: 404,
                    msg: responseMessages.invalidCreds,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Reset Password ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })();
}

/*
|------------------------------------------------ 
| API name          :  userList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch All User List
| Request URL       :  BASE_URL/user/all_user_list
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const userList = (req, res) => {
    (async () => {
        let purpose = "Fetch All User List";
        try {
            let userList = await UserRepositories.find({});

            userList.forEach(element => {
                delete element.password;
            })

            return res.send({
                status: 200,
                msg: responseMessages.userList,
                data: userList,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Fetch All User List Error : ", err);
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
| API name          :  userDetail
| Response          :  Respective response message in JSON format
| Logic             :  Fetch User Detail
| Request URL       :  BASE_URL/user/user_detail
| Request method    :  GET
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const userDetail = (req, res) => {
    (async () => {
        let purpose = "Fetch User Detail";
        try {
            let userID = req.headers.userID;
            let userDetail = await UserRepositories.find({ _id: userID });

            return res.send({
                status: 200,
                msg: responseMessages.userDetails,
                data: userDetail,
                purpose: purpose
            })
        }
        catch (err) {
            console.log("Fetch User Detail Error : ", err);
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
| API name          :  userLogout
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/user/logout
| Request method    :  PUT
| Author            :  Mainak Saha
|------------------------------------------------
*/
export const userLogout = (req, res) => {
    (async () => {
        let purpose = "User Login";
        try {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.clearCookie('myCookieExpiry');
            return res.send({
                status: 200,
                msg: responseMessages.logoutSuccess,
                data: {},
                purpose: purpose
            })
        }
        catch (err) {
            console.log("User Login Error : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}