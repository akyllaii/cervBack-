import UsersModel from '../../models/users.js'





export const getAllUser = async (req, res) => {
    try {

        const users = await UsersModel.find({
            status: req.query.status
        })

        res.json(users)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить пользователей'
        })
    }
}

export const getOneUser = async (req,res) => {
    try {

        const review = await UsersModel.findById(req.params.id)

        res.json(review)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить юзера'
        })
    }
}