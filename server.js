const mongoose = require("mongoose");

const app = require("./app");

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
