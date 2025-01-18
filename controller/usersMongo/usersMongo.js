import UsersModel from '../../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const register = async (req,res) => {
    try {

        const {password,...other} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);

        const doc = new UsersModel({
            ...other,
            passwordHash: hash
        });


        const user = await doc.save();

        const {passwordHash,...userData} = user._doc;

        const token = jwt.sign({
            _id: user._id
        },'secret123',{expiresIn:'90d'});

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to register'
        })
    }
}


export const login = async (req,res) => {
    try {
        const user = await UsersModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: 'такого аккаунта не существует'
            })
        }

        const invalidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!invalidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id
        },'secret123',{expiresIn:'90d'});

        const {passwordHash,...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: 'не удалось войти'
        })
    }
}

export const resetPassword = async (req, res) => {
    try {

        const user = await UsersModel.findOne({email: req.body.email})

        const inValidPass = await bcrypt.compare(req.body.oldPassword, user._doc.passwordHash)

        if (!inValidPass) {
            return res.status(404).json({
                message: 'Неверный старый пароль'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.newPassword, salt)

        await UsersModel.updateOne({email: req.body.email}, {
            passwordHash: hash
        }, {returnDocument: 'after'})

        res.json({
            message: 'Пароль изменен',
            status: 'success'
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось поменять пароль'
        })
    }
}