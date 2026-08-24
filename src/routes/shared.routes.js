const express = require('express');
const { testimonialController, faqController, contactMessageController, demoRequestController } = require('../controllers/shared.controller');
const { createTestimonialValidator, createFAQValidator, createContactMessageValidator, createDemoRequestValidator, updateTestimonialValidator, updateStatusValidator, paginateValidator } = require('../validators/shared.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const createRouter = (controller, createVal, updateVal) => {
  const router = express.Router();

  // Public POST (e.g. for leads to submit from frontend)
  // For Testimonials/FAQs, this would normally be admin-only, but we'll apply it globally via a simple check or assume frontend only calls GET
  // We'll separate public vs admin

  return router;
};

// Testimonials Router
const testimonialRouter = express.Router();
testimonialRouter.get('/', paginateValidator, validate, asyncHandler(testimonialController.getAll));
testimonialRouter.get('/:id', asyncHandler(testimonialController.getById));
testimonialRouter.use(authenticate); // Admin only below
testimonialRouter.post('/', createTestimonialValidator, validate, asyncHandler(testimonialController.create));
testimonialRouter.put('/:id', updateTestimonialValidator, validate, asyncHandler(testimonialController.update));
testimonialRouter.delete('/:id', asyncHandler(testimonialController.delete));

// FAQs Router
const faqRouter = express.Router();
faqRouter.get('/', paginateValidator, validate, asyncHandler(faqController.getAll));
faqRouter.get('/:id', asyncHandler(faqController.getById));
faqRouter.use(authenticate);
faqRouter.post('/', createFAQValidator, validate, asyncHandler(faqController.create));
faqRouter.put('/:id', updateTestimonialValidator /* relaxed update */, validate, asyncHandler(faqController.update));
faqRouter.delete('/:id', asyncHandler(faqController.delete));

// Contact Messages Router
const contactRouter = express.Router();
contactRouter.post('/', createContactMessageValidator, validate, asyncHandler(contactMessageController.create)); // Public can submit
contactRouter.use(authenticate);
const authorize = require('../middlewares/authorize');
contactRouter.use(authorize('manage_contacts'));
contactRouter.get('/', paginateValidator, validate, asyncHandler(contactMessageController.getAll));
contactRouter.get('/:id', asyncHandler(contactMessageController.getById));
contactRouter.put('/:id', asyncHandler(contactMessageController.update));
contactRouter.patch('/:id/status', updateStatusValidator, validate, asyncHandler(contactMessageController.update));
contactRouter.delete('/:id', asyncHandler(contactMessageController.delete));

// Demo Requests Router
const demoRouter = express.Router();
demoRouter.post('/', createDemoRequestValidator, validate, asyncHandler(demoRequestController.create)); // Public can submit
demoRouter.use(authenticate);
demoRouter.use(authorize('manage_leads'));
demoRouter.get('/', paginateValidator, validate, asyncHandler(demoRequestController.getAll));
demoRouter.get('/:id', asyncHandler(demoRequestController.getById));
demoRouter.put('/:id', asyncHandler(demoRequestController.update));
demoRouter.patch('/:id/status', updateStatusValidator, validate, asyncHandler(demoRequestController.update));
demoRouter.delete('/:id', asyncHandler(demoRequestController.delete));

module.exports = {
  testimonialRouter,
  faqRouter,
  contactRouter,
  demoRouter
};
