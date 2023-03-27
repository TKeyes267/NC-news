const app = require("./app.js");

const port = 9090;

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("listening on port 9090");
});
