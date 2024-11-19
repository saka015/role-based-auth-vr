const mongoosee = require("mongoose");
mongoosee.connect(
  "mongodb+srv://skn8454:saka123@cluster0.mkddo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const expresss = require("express");
const app = express();

app.listen(3000, function () {
  console.log("server connected");
});
