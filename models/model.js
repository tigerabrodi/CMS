const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require("bcryptjs");




const postSchema = new Schema({
    title: String,
    description: String,
    context: String,
    author: {
        type: Schema.Types.ObjectId,
    },
    comments: [{
        context: String,
        author: String,
        createdAt: Date
    }]
});


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    posts: [postSchema]
});

const commentSchema = new Schema ({
    context: {
        type: String
    }

})


userSchema.pre("save", async function save(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
});


const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    Post
}