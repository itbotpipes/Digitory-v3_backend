const mongoose = require('mongoose');
const navigationItemSchema = require('./schemas/NavigationItem.schema');

const navigationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
      enum: ['header', 'footer'],
    },
    items: [navigationItemSchema],
  },
  {
    timestamps: true,
  }
);

navigationSchema.index({ location: 1 });

// Pre-save hook to ensure items are ordered properly before saving
navigationSchema.pre('save', function () {
  const sortItems = (items) => {
    if (!items || items.length === 0) return items;
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children = sortItems(item.children);
      }
    });
    return items;
  };

  if (this.isModified('items')) {
    this.items = sortItems(this.items);
  }
});

const Navigation = mongoose.model('Navigation', navigationSchema);

module.exports = Navigation;
