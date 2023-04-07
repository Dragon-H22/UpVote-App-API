

import joi from 'joi'
import { generalFields } from '../../middleware/validation.js';

export const signup = {
    body: joi.object({
        userName: generalFields.userName,
        email: generalFields.email,
        password: generalFields.password,
        cPassword: generalFields.cPassword.valid(joi.ref('password')),
        age: joi.number().integer().min(12).max(90),
        firstName: joi.string().alphanum().min(2).max(15),
        lastName: joi.string().alphanum().min(2).max(15),
        gender: generalFields.gender,
        phone: generalFields.phone,
        profilePic: joi.string(),
        coverPic: joi.string(),
        address: joi.string().alphanum(),
    }).required(),

};



export const login = {
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password,
    }).required()
};