const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
// const post  = require('../routes');

module.exports.create = async function(req, res){
    let post = await Post.findById(req.body.post);
        try{
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            
            });
            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('Error in sending to queue', err);
                    return;
                }
                console.group('Job enqueued', job.id);
            })

            if (req.xhr){
                // Similar for comments to fetch the user's id!
                // comment = await comment.populate('user', 'name').execPopulate();
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');
            res.redirect('/');
            }
        }
        catch(err){
            console.log('Error', err);
            return;
        }
        }

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;

            comment.remove();
            let post =  Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error', err);
        return;

    }
    }