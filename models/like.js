const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId
    }, 
    //this defines object id on liked object
    likeable:{
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    // this field is used for defining type of liked object as this is a dynamic reference
    onModel:{
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    },
},
    {
        timestamps: true
});

const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;