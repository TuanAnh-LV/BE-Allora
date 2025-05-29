exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };
  
  exports.isSelfOrAdmin = (req, res, next) => {
    if (req.user.role === 'admin' || parseInt(req.params.id) === req.user.id) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied.' });
  };