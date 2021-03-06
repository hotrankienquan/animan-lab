const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { nonExistChecker } = require("../helper/existChecker");

module.exports = {
  getPost: async (req, res, next) => {
    const posts = await Post.find({ approve: false }, { __v: 0 });
    return res.status(200).json({ success: true, posts });
  },

  getComments: async (req, res, next) => {
    const comments = await Comment.find({ approve: false }, { __v: 0 });
    return res.status(200).json({ success: true, comments });
  },

  getFlagPost: async (req, res, next) => {
    const posts = await Post.find({ is_flag: true }, { __v: 0 });
    return res.status(200).json({ success: true, posts });
  },

  approvePost: async (req, res, next) => {
    const { id } = req.verified.body;
    const post = await Post.findById(id);

    nonExistChecker(post, "Post not found", res);

    const { approve } = post;

    if (!approve) {
      await post.updateOne({ approve: true });
      const user = await User.findById(post.author_id);
      let { points } = user;
      points += 10;
      await user.updateOne({ points });
    }

    res.status(200).json({ success: true });
  },

  approveComment: async (req, res, next) => {
    const { id } = req.verified.body;
    const comment = await Comment.findById(id);
    nonExistChecker(comment, "Comment not found", res);

    const { approve } = comment;

    if (!approve) {
      await comment.updateOne({ approve: true });
      const user = await User.findById(comment.author_id);
      let { points } = user;
      points += 1;
      await user.updateOne({ points });
    }

    res.status(200).json({ success: true });
  },

  banUser: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);

    nonExistChecker(user, "User not found", res);

    await user.updateOne({ can_post: false, can_comment: false });

    res.status(200).json({ success: true });
  },

  unbanUser: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);

    nonExistChecker(user, "User not found", res);

    await user.updateOne({ can_post: true, can_comment: true });

    res.status(200).json({ success: true });
  },

  appointMod: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);
    const { roles } = user;

    nonExistChecker(user, "User not found", res);

    if (!roles.includes("mod")) {
      roles.push("mod");
      await user.updateOne({ roles });
    }

    res.status(200).json({ success: true });
  },

  deposedMod: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);
    let { roles } = user;

    nonExistChecker(user, "User not found", res);

    if (roles.includes("mod")) {
      roles = roles.filter((role) => role !== "mod");
      await user.updateOne({ roles });
    }

    res.status(200).json({ success: true });
  },

  getFlagComment: async (req, res, next) => {
    const comment = await Post.find({ flag: true }, { __v: 0 });
    return res.status(200).json({ success: true, comment });
  },
};
