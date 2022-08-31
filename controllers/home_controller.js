const Post = require("../models/post")

module.exports.home = function(req, res){
    // return res.render('./home.ejs',{
    //     title: "Home"
    // });

    // Post.find({}, function(err, posts){
    //     return res.render('home',{
    //         title: 'Home', 
    //         posts: posts
    //     });
    // });
    
    //populate user of each post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    }) 
    .exec(function(err, posts){
        return res.render('home',{
                    title: 'Home', 
                    posts: posts
                });
    })
}