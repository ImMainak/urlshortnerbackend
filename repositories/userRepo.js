import User from '../models/users.js';

export const create = (data) => {
    return new Promise((resolve, reject) => {
        let userCreate = new User(data);
        userCreate.save().then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const updateMany = (where, data) => {
    return new Promise((resolve, reject) => {
        User.updateMany(where, data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const findOne = (where) => {
    return new Promise((resolve, reject) => {
        User.findOne(where).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const count = (where) => {
    return new Promise((resolve, reject) => {
        User.countDocuments(where).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const find = (where, data) => {
    return new Promise((resolve, reject) => {
        User.find(where).skip(data?.offset ?? 0).sort({ date: -1 }).limit(data?.limit ?? 0).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const deleteOne = (where) => {
    return new Promise((resolve, reject) => {
        User.deleteOne(where).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const updateOne = (where, data) => {
    return new Promise((resolve, reject) => {
        User.updateOne(where, data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}