const postService = require('../services/post.service');
const ApiResponse = require('../utils/ApiResponse');

class PostController {
  async createPost(req, res) {
    const post = await postService.createPost(req.body, req.user.id);
    res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
  }

  async getPosts(req, res) {
    const { page = 1, limit = 10, search, category, status, sort, isFeatured } = req.query;
    const isAdmin = !!req.user; // If request passes auth (admin panel), we allow fetching drafts
    
    const result = await postService.getPosts(page, limit, search, category, status, sort, isAdmin, isFeatured);
    res.status(200).json(new ApiResponse(200, result, 'Posts fetched successfully'));
  }

  async getPost(req, res) {
    // Can be ID or slug
    const post = await postService.getPostByIdOrSlug(req.params.idOrSlug);
    res.status(200).json(new ApiResponse(200, post, 'Post fetched successfully'));
  }

  async updatePost(req, res) {
    const post = await postService.updatePost(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, post, 'Post updated successfully'));
  }

  async publishPost(req, res) {
    const post = await postService.publishPost(req.params.id);
    res.status(200).json(new ApiResponse(200, post, 'Post published successfully'));
  }

  async unpublishPost(req, res) {
    const post = await postService.unpublishPost(req.params.id);
    res.status(200).json(new ApiResponse(200, post, 'Post unpublished successfully'));
  }

  async deletePost(req, res) {
    await postService.deletePost(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Post deleted successfully'));
  }
}

module.exports = new PostController();
