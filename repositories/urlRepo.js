import URL from '../models/url.js';

export const create = (data) => {
    return new Promise((resolve, reject) => {
        let urlCreate = new URL(data);
        urlCreate.save().then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const updateMany = (where, data) => {
    return new Promise((resolve, reject) => {
        URL.updateMany(where, data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const findOne = (where) => {
    return new Promise((resolve, reject) => {
        URL.findOne(where).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const count = (where) => {
    return new Promise((resolve, reject) => {
        URL.countDocuments(where).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const find = (where, data) => {
    return new Promise((resolve, reject) => {
        URL.find(where).skip(data?.offset ?? 0).sort({ date: -1 }).limit(data?.limit ?? 0).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const deleteOne = (where) => {
    return new Promise((resolve, reject) => {
        URL.deleteOne(where).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const updateOne = (where, data) => {
    return new Promise((resolve, reject) => {
        URL.updateOne(where, data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}