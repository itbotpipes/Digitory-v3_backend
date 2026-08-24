const User = require('../models/User.model');
const Page = require('../models/Page.model');
const Post = require('../models/Post.model');
const Media = require('../models/Media.model');
const ContactMessage = require('../models/ContactMessage.model');
const DemoRequest = require('../models/DemoRequest.model');
const ApiResponse = require('../utils/ApiResponse');

class DashboardController {
  async getDashboardStats(req, res) {
    const [
      totalUsers,
      totalPages,
      totalPosts,
      totalMedia,
      totalContactMessages,
      totalDemoRequests,
      recentPosts,
      recentContactMessages,
      recentDemoRequests
    ] = await Promise.all([
      User.countDocuments(),
      Page.countDocuments(),
      Post.countDocuments({ isDeleted: false }),
      Media.countDocuments(),
      ContactMessage.countDocuments(),
      DemoRequest.countDocuments(),
      Post.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).populate('category'),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
      DemoRequest.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const stats = {
      totals: {
        users: totalUsers,
        pages: totalPages,
        posts: totalPosts,
        media: totalMedia,
        contactMessages: totalContactMessages,
        demoRequests: totalDemoRequests,
      },
      recent: {
        posts: recentPosts,
        leads: [...recentContactMessages, ...recentDemoRequests].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
      }
    };

    res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
  }
}

module.exports = new DashboardController();
