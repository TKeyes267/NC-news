const db = require("./db/connection");

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.errors404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: "Invalid URL" });
  } else {
    next(err);
  }
};

exports.errorsPSQL = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid Request" });
  } else {
    next(err);
  }
};

exports.errorsServer = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error!" });
};
