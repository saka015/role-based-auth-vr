import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
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

export const seedRoles = async () => {
  try {
    const roles = await Role.find({});
    if (roles.length === 0) {
      // Check if roles exist, if not seed them
      await Role.deleteMany({});
      for (const role of predefinedRoles) {
        await Role.create(role);
        console.log(`Seeded role: ${role.name}`);
      }
    }
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
};
