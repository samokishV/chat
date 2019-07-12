exports.isAuthenticated = (req, res, next) => {
  if (req.cookies['user_id']) return next();
  return res.redirectToRoute('login');
};
