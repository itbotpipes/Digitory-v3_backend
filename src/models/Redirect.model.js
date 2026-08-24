const mongoose = require('mongoose');

const redirectSchema = new mongoose.Schema(
  {
    oldUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    newUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      enum: [301, 302],
      default: 301,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Redirect = mongoose.model('Redirect', redirectSchema);
module.exports = Redirect;
