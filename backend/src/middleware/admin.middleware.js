export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - No user info" });
        }

        if (req.user.role != 'admin') {
            return res.status(403).json({ message: "Forbidden - Admins only" });
        }

        return next();
    } catch (error) {
        next(error);
    }
};
