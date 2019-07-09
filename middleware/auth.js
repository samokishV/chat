exports.isAuthenticated = (req, res, next) => {
    if (req.session.user_id)
        return next();

    res.redirectToRoute('login');
};