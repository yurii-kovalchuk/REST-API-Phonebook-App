const funcShell = (func) => {
  const finalFunc = async (req, res, next) => {
    try {
      await func(req, res);
    } catch (err) {
      next(err);
    }
  };

  return finalFunc;
};

module.exports = funcShell;
