const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

roleSchema.methods.hasPermission = function (permission) {
  if (this.permissions.includes('*')) return true;
  return this.permissions.includes(permission);
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
