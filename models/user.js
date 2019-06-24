const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require("bcryptjs");


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    }
});


userSchema.pre("save", async function save(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
});



module.exports = mongoose.model("User", userSchema);