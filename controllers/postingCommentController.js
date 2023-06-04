const PostingComments = require('../models/postingComment');
const { validationResult } = require("express-validator");
const createPostingComment = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Create a new post
        const postComment = new PostingComments({
            description: req.body.description,
            userPostingComment: req.user.id,
            posting: req.body.posting,
            img: req.body.img,
        });

        // Save the post to the database
        await postComment.save();

        res.status(201).json({
            status: "Success",
            messages: "Post created successfully!",
            data: { postComment },
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            messages: err.message,
        });
    }
};
const getAllPostingCommentByPost = async (req, res) => {
    try {
      const postingId = req.params.id;
      const postingComments = await PostingComments.find({ posting: postingId }).populate(
        "posting userPostingComment"
      );
      res.status(200).json({
        status: "Success",
        messages: "Get postings successfully!",
        data: { postingComments },
      });
    } catch (err) {
      res.status(500).json({
        status: "Fail",
        messages: err.message,
      });
    }
  };

  const getAllPostingComment = async (req, res) => {
    try {
      const postingComments = await PostingComments.find({ }).populate(
        "posting userPostingComment"
      );
      res.status(200).json({
        status: "Success",
        messages: "Get postings successfully!",
        data: { postingComments },
      });
    } catch (err) {
      res.status(500).json({
        status: "Fail",
        messages: err.message,
      });
    }
  };
  
module.exports = {
    createPostingComment,
    getAllPostingCommentByPost,
    getAllPostingComment,
}