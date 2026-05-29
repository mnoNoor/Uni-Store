export const serializeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.verifyToken;
  delete obj.verifyTokenExp;
  delete obj.pwdResetToken;
  delete obj.pwdResetExp;
  return {
    _id: obj._id,
    id: obj._id,
    username: obj.username,
    email: obj.email,
    image: obj.image,
    role: obj.role,
    createdAt: obj.createdAt,
    lastLogin: obj.lastLogin,
  };
};
