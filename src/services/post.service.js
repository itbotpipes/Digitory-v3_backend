const postRepository = require('../repositories/Post.repository');
const categoryRepository = require('../repositories/Category.repository');
const ApiError = require('../utils/ApiError');

class PostService {
  async createPost(data, authorId) {
    data.author = authorId;

    if (data.slug) {
      const existing = await postRepository.findBySlug(data.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }

    if (!data.category || data.category === '') {
      let cat = await categoryRepository.findByName('Articles');
      if (!cat) {
        cat = await categoryRepository.create({ name: 'Articles', slug: 'articles' });
      }
      data.category = cat._id;
    } else {
      const cat = await categoryRepository.findById(data.category);
      if (!cat) throw new ApiError(404, 'Category not found');
    }

    if (data.tags && Array.isArray(data.tags)) {
      data.tags = data.tags.map(t => typeof t === 'object' && t !== null && t.tag ? t.tag : String(t));
    }

    if (data.status === 'Published') {
      data.publishedAt = new Date();
    }

    return await postRepository.create(data);
  }

  async updatePost(id, updateData) {
    const post = await postRepository.findById(id);
    if (!post) throw new ApiError(404, 'Post not found');

    if (updateData.slug && updateData.slug !== post.slug) {
      const existing = await postRepository.findBySlug(updateData.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }

    if (updateData.category && updateData.category !== String(post.category?._id)) {
      if (updateData.category === '') {
        let cat = await categoryRepository.findByName('Articles');
        if (!cat) {
          cat = await categoryRepository.create({ name: 'Articles', slug: 'articles' });
        }
        updateData.category = cat._id;
      } else {
        const cat = await categoryRepository.findById(updateData.category);
        if (!cat) throw new ApiError(404, 'Category not found');
      }
    }

    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.map(t => typeof t === 'object' && t !== null && t.tag ? t.tag : String(t));
    }

    if (post.category && post.category._id) {
      post.category = post.category._id;
    }
    if (post.author && post.author._id) {
      post.author = post.author._id;
    }
    // Allow explicit author override from editor
    if (updateData.author && updateData.author !== '') {
      post.author = updateData.author;
      delete updateData.author; // handled directly
    }
    Object.assign(post, updateData);
    // Explicitly update 'updatedAt' natively due to standard mongoose timestamps
    await post.save();
    return post;
  }

  async getPosts(page, limit, search, category, status, sortString, isAdmin = false, isFeatured) {
    const filters = {};
    
    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filters.category = category;
    
    if (status) {
      filters.status = status;
    } else if (!isAdmin) {
      filters.status = 'Published';
    }

    let sort = { createdAt: -1 };
    if (sortString) {
      // e.g. "title" -> ascending, "-title" -> descending
      const sortField = sortString.replace('-', '');
      const sortOrder = sortString.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    return await postRepository.paginate(page, limit, filters, sort);
  }

  async getPostByIdOrSlug(identifier) {
    let post;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      post = await postRepository.findById(identifier);
    } else {
      post = await postRepository.findBySlug(identifier);
    }
    if (!post) throw new ApiError(404, 'Post not found');
    return post;
  }

  async publishPost(id) {
    const post = await postRepository.findById(id);
    if (!post) throw new ApiError(404, 'Post not found');
    post.status = 'Published';
    post.publishedAt = new Date();
    await post.save();
    return post;
  }

  async unpublishPost(id) {
    const post = await postRepository.findById(id);
    if (!post) throw new ApiError(404, 'Post not found');
    post.status = 'Draft';
    post.publishedAt = null;
    await post.save();
    return post;
  }

  async deletePost(id) {
    const post = await postRepository.findById(id);
    if (!post) throw new ApiError(404, 'Post not found');
    await postRepository.softDelete(id);
    return true;
  }
}

module.exports = new PostService();
