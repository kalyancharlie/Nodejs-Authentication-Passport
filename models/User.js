const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log("Hashing Error:", err);
        }
        return hash;
    });
};

UserSchema.methods.validPassword = function (password) {
    // return true;
    return bcrypt.compareSync(password, this.password, (err, isValid) => {
        if (err) {
            console.log("Comparison Error:", err);
        }
        console.log('valid pass', isValid)
        return isValid;
    });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
