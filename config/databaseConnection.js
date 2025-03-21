const mongoose = require("mongoose");
require("dotenv").config();
const databaseConnection =async ()=>{ mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    // console.log("Database Connection Successfull");
  })
  .catch((error) => {
    console.error(error);
    console.log("Database Connection Error");
    process.exit(1);
  });
}
module.exports = databaseConnection;




