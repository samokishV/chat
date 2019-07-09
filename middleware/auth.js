exports.isAuthenticated = (req, res, next) => {
  if (req.session.user_id) return next();
  return res.redirectToRoute('login');
};
