import {body} from "express-validator";
import {validationResult} from "express-validator";

export  default (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }
    next()
}


export const registerUserValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('name', 'Укажите ваше имя').isString(),
    body('surname', 'Укажите вашу фамилию').isString(),
    body('password','Неверный формат почты').isString(),
]

export const loginUserValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isString()
]
export const resetPasswordValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('oldPassword', 'Пароль должен быть минимум 8 символов').isLength({min:8}),
    body('newPassword', 'Пароль должен быть минимум 8 символов').isLength({min:8})
]