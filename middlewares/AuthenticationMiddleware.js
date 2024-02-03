import jwt from 'jsonwebtoken';
import responseMessages from '../ResponseMessages.js';

// ################################ Repositories ################################ //
import * as UserRepo from '../repositories/userRepo.js';

// ################################ Globals ################################ //
// const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;

//User Authentication
export const authenticateRequestAPI = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
            let accessToken = req.headers.authorization.split(" ")[1];
            // if (/postman/ig.test(req.headers['user-agent'])) {
            //     accessToken = req?.cookies?.access_token;
            // } else {
            //     accessToken = req.headers.authorization.split(" ")[1]
            // }
            jwt.verify(
                accessToken,
                jwtOptionsAccess.secret,
                async (err, decodedToken) => {
                    if (err) {
                        return res.status(401).json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        });
                    } else {
                        let userCount = await UserRepo.count({ _id: decodedToken.user_id });
                        if (userCount == 0) {
                            return res.status(401).json({
                                status: 404,
                                msg: responseMessages.userNotFound,
                            });
                        }

                        if (userCount) {
                            req.headers.userID = decodedToken.user_id;
                            next();
                        } else {
                            return res.status(401).json({
                                status: 401,
                                msg: responseMessages.authFailure,
                            });
                        }
                    }
                }
            );
        } else if(req?.cookies?.access_token) {
            const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
            let accessToken = req?.cookies?.access_token;
            
            jwt.verify(
                accessToken,
                jwtOptionsAccess.secret,
                async (err, decodedToken) => {
                    if (err) {
                        return res.status(401).json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        });
                    } else {
                        let userCount = await UserRepo.count({ _id: decodedToken.user_id });
                        if (userCount == 0) {
                            return res.status(401).json({
                                status: 404,
                                msg: responseMessages.userNotFound,
                            });
                        }

                        if (userCount) {
                            req.headers.userID = decodedToken.user_id;
                            next();
                        } else {
                            return res.status(401).json({
                                status: 401,
                                msg: responseMessages.authFailure,
                            });
                        }
                    }
                }
            );
        } else if (!(/postman/ig.test(req.headers['user-agent']))) {
            res.redirect('/web/login');
        } else {
            return res.status(401).json({
                status: 401,
                msg: responseMessages.authRequired,
            });
        }
    } catch (e) {
        console.log("Middleware Error : ", e);
        res.json({
            status: 500,
            message: responseMessages.serverError,
        });
    }
};