exports.paginate = (defaultLimit = 10, maxLimit = 100) => {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || defaultLimit), maxLimit);
    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };
    next();
  };
};
