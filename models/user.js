const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")
const moment = require("moment-timezone");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "first name is required"],
        minLength: [3, "first name must be at least 3 characters"],
        maxLength: [15, "first name must be less than or equal to 15 characters"]
    },
    lastName: {
        type: String,
        required: [true, "last name is required"],
        minLength: [3, "last name must be at least 3 characters"],
        maxLength: [15, "last na    me must be less than or equal to 15 characters"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [8, "password must be at least 8 characters"],
        validate: {
            validator: (value) =>
                validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                }),
            message: "password must contain upper, lower, number, and symbol"
        }
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
        minlength: [11, "phone must be at least 11 number"],
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'any'),
            message: "please enter a valid phone number"
        }
    },
    gender: {
        type: String,
        required: [true, "gender is required"],
        enum: {
            values: ['male', 'female'],
            message: 'Gender must be either male or female'
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, "date of birth is required"]
    },
    role: {
        type: String,
        enum: ['admin', 'patient', 'doctor'],
        default: 'patient'
    },
    imageUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK4c_lXzfD_8hMdLR8LSVOanf2bhADHCwV_mG_XvGHYuP_XLas6x_3ku8eiCz5r3PV7Xg&usqp=CAU"
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
    }
})

/* we use this to change time ==> to cairo time */
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    const moment = require("moment-timezone");

    obj.createdAt = moment(obj.createdAt).tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss");
    obj.updatedAt = moment(obj.updatedAt).tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss");

    return obj;
};


var userModel = mongoose.model("user", userSchema)
module.exports = { userModel };


/*
{
    "firstName": "",
    "lastName": "",
    "email": "",
    "password": "",
    "phone": "",
    "gender": "",
    "dateOfBirth": "",
    "role": "",
    "imageUrl": ","
}
*/

/*
{
    "firstName": "Gamal",
    "lastName": "Hassan",
    "email": "Gamal@gmail.com",
    "password": "Gg@12345",
    "phone": "01024689742",
    "dateOfBirth": "2003-08-25",
    "gender": "male"
}
*/