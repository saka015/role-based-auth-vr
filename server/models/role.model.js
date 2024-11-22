import mongoose from "mongoose";

// Role Schema
export const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  permissions: {
    status: { type: Boolean, default: false },
    access: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
});

export const Role = mongoose.model("Role", roleSchema);

// Predefine roles
export const predefinedRoles = [
  {
    name: "user",
    permissions: { status: false, access: false, edit: false, delete: false },
  },
  {
    name: "maintainer",
    permissions: { status: true, access: true, edit: true, delete: false },
  },
  {
    name: "admin",
    permissions: { status: true, access: true, edit: true, delete: true },
  },
];

// Seed predefined roles into the database
export const seedRoles = async () => {
  for (const role of predefinedRoles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      await Role.create(role);
    }
  }
};

// Call the seedRoles function during app startup
