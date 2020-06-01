const joi =require('@hapi/joi');

// REGISTER VALIDATION WITH JOI
const regesterValidation = (data)=>{
const schema = {
    name : joi.string().required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
    city: joi.string().required(),
    state: joi.string().required(),
    phone: joi.string().required(),
    hostelname:joi.string().required()
};
return joi.validate(data,schema);
}

//LOGIN VALIDATION
const loginValidation = (data)=>{
    const schema = {
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    };
    return joi.validate(data,schema);
    }

module.exports.regesterValidation= regesterValidation;
module.exports.loginValidation= loginValidation;
