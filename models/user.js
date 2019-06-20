const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true
    }
});



module.exports = mongoose.model("User", userSchema);