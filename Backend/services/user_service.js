import UserModel from '../models/user.js'

export const createUser = async ({ name, email, password }) => {
    const user = await UserModel.create({
        name, email, password
    })

    console.log("user created " + user);
    return user;
}

export const getAllUser = async () => {

    const allUsers = await UserModel.find({});

    console.log('Is running');

    return allUsers
}