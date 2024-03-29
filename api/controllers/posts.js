const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const cloudinary = require("cloudinary").v2;

const getPostsbyId = async (req, res) => {
  try {
    // Accessing userId sent as a query parameter
    const userId = req.query.userId;
    console.log(userId);
    const posts = await Post.find({ createdBy: userId }).populate(
      "createdBy",
      "username _id"
    );
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Failed to fetch posts by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // Populate 'createdBy' with user details, specifically 'username'
    const posts = await Post.find().populate("createdBy", "username _id");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    // Ensure 'message' field is present
    if (!req.body.message && !req.body.imageUrl) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if an image file was uploaded in the incoming request using Multier
    let imageUrl = null;
    if (req.body.imageUrl) {
      console.log(req.file);
      // If image added, save the image URL
      imageUrl = req.body.imageUrl;
    }

    const newPost = new Post({
      message: req.body.message || "",
      image: imageUrl,
      createdBy: req.user_id,
    });
    await newPost.save();

    // Populate 'createdBy' before sending the response
    const populatedPost = await Post.findById(newPost._id).populate(
      "createdBy",
      "username"
    );

    // Generate a new token
    const newToken = generateToken(req.user_id);
    res.status(201).json({ post: populatedPost, token: newToken });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    // Check if the post exists and is created by the logged-in user
    const postToDelete = await Post.findById(postId);
    if (!postToDelete || postToDelete.createdBy.toString() !== req.user_id) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    // delete post with MongoDB syntax
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { message } = req.body;
    const postToUpdate = await Post.findById(postId);
    if (!postToUpdate || postToUpdate.createdBy.toString() !== req.user_id) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    // update post with the new message
    postToUpdate.message = message;
    await postToUpdate.save();

    res
      .status(200)
      .json({ message: "Post updated successfully.", post: postToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Added Update Likes
const updateLikes = async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes.push(req.user_id);
  await post.save();
  res.status(200).json({ post, user: req.user_id });
};

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getPostsbyId: getPostsbyId,
  deletePost: deletePost,
  updateLikes: updateLikes,
  updatePost: updatePost,
};

module.exports = PostsController;
