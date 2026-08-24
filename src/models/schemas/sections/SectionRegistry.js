const sectionBaseSchema = require('./SectionBase.schema');

const HeroSchema = require('./types/Hero.schema');
const CTASchema = require('./types/CTA.schema');
const FAQSchema = require('./types/FAQ.schema');
const GallerySchema = require('./types/Gallery.schema');
const TestimonialsSchema = require('./types/Testimonials.schema');
const RichTextSchema = require('./types/RichText.schema');

sectionBaseSchema.discriminator('hero', HeroSchema);
sectionBaseSchema.discriminator('cta', CTASchema);
sectionBaseSchema.discriminator('faq', FAQSchema);
sectionBaseSchema.discriminator('gallery', GallerySchema);
sectionBaseSchema.discriminator('testimonials', TestimonialsSchema);
sectionBaseSchema.discriminator('rich-text', RichTextSchema);

module.exports = sectionBaseSchema;
