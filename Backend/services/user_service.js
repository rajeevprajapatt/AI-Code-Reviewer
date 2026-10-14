import UserModel from '../models/user.js'

export const createUser = async ({ name, email, password }) => {
    const user = await UserModel.create({
        name, email, password
    })

    return user;
}

export const getAllUser = async () => {

    const allUsers = await UserModel.find({});

    return allUsers
}