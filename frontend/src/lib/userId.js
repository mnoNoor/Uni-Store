export const getUserId = (user) => {
  if (!user) return null;
  return String(user._id || user.id);
};

export const isAdminRole = (user) =>
  user && ["admin", "superadmin"].includes(user.role);

export const isSuperAdmin = (user) => user?.role === "superadmin";
