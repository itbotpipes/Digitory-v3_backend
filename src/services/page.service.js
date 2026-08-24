const pageRepository = require('../repositories/Page.repository');
const ApiError = require('../utils/ApiError');

class PageService {
  async createPage(pageData) {
    if (pageData.slug) {
      const existing = await pageRepository.findBySlug(pageData.slug);
      if (existing) {
        throw new ApiError(400, 'Slug is already in use');
      }
    }
    return await pageRepository.create(pageData);
  }

  async getPages(page, limit, search, status) {
    const filters = {};
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filters.status = status;

    return await pageRepository.paginate(page, limit, filters);
  }

  async getPageById(id) {
    const page = await pageRepository.findById(id);
    if (!page) throw new ApiError(404, 'Page not found');
    return page;
  }

  async getPageBySlug(slug) {
    const page = await pageRepository.findBySlug(slug);
    if (!page) throw new ApiError(404, 'Page not found');
    return page;
  }

  async updatePage(id, updateData) {
    const page = await pageRepository.findById(id);
    if (!page) throw new ApiError(404, 'Page not found');

    if (updateData.slug && updateData.slug !== page.slug) {
      const existing = await pageRepository.findBySlug(updateData.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }

    Object.assign(page, updateData);
    await page.save(); // Utilizing pre-validate hook for slug generation/validation
    return page;
  }

  async publishPage(id) {
    const page = await pageRepository.findById(id);
    if (!page) throw new ApiError(404, 'Page not found');
    await page.publish();
    return page;
  }

  async unpublishPage(id) {
    const page = await pageRepository.findById(id);
    if (!page) throw new ApiError(404, 'Page not found');
    await page.unpublish();
    return page;
  }

  async deletePage(id) {
    const page = await pageRepository.findById(id);
    if (!page) throw new ApiError(404, 'Page not found');
    await pageRepository.delete(id);
    return true;
  }
}

module.exports = new PageService();
