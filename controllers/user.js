const { userModel } = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const validator = require('validator')
const mongoose = require("mongoose");

/* add new user (done)*/
const addNewUser = async (req, res) => {
    var user = req.body
    try {
        // const { firstName, lastName, email, password, phone, gender, dateOfBirth } = req.body;

        // if (!firstName || !lastName || !email || !password || !phone || !gender || !dateOfBirth) {
        //     return res.status(400).json({ message: "All fields are required" });
        // }

        let { dateOfBirth } = req.body;
        dateOfBirth = new Date(dateOfBirth)

        const { email } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }


        const newUser = await userModel.create(req.body);
        const userResponse = newUser.toObject();
        delete userResponse.password;

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || "secretKey",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "New user created successfully",
            user: newUser,
            token
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

/* get all users (done)*/
var getAllUsers = async (req, res) => {
    try {
        var users = await userModel.find().select("-password -__v");
        res.status(200).json({ message: "all users ", users })
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
};

/* get specific user (done)*/
const getUserById = async (req, res) => {
    const { id } = req.params;
    //verify the ObjectId (id uses hexadecimal $ length 24 character)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    try {
        const specificUser = await userModel.findById(id);

        if (!specificUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Specific user", user: specificUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* update user (done)*/
const updateUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    var newData = req.body
    try {
        if (newData.password) {
            if (!validator.isStrongPassword(newData.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                return res.status(400).json({ message: "password must be at least 8 characters and must contain upper, lower, number, and symbol" });
            }
            const salt = await bcrypt.genSalt(10);
            newData.password = await bcrypt.hash(newData.password, salt);
        }
        const userAfterUpdated = await userModel.findOneAndUpdate({ _id: id }, newData, { new: true });
        if (!userAfterUpdated) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "update user done ", userAfterUpdated })
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* delete user (done)*/
const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(204).json({ message: "delete user done ", deletedUser })
        /* to show the message ==> change status from 204 to 201 */
        /* because 204 ==> do not send message */
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

module.exports = { addNewUser, getAllUsers, updateUser, deleteUser, getUserById }