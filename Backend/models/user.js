import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.getUser = async function (email) {
    return await this.findOne({ email: email })
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateJWT = function () {
    return jwt.sign({
        email: this.email
    }, process.env.SECRET_KEY)
}


const User = mongoose.model('User', userSchema);

export default User;