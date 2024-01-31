// const JoiBase = require("joi");
// const JoiDate = require("@hapi/joi-date");

import JoiBase from 'joi';
import JoiDate from '@hapi/joi-date';
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

// Create URL Schema
export const urlCreateSchema = Joi.object().keys({
    originalURL: Joi.string().required()
});