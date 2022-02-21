const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

var fs = require("fs");
var https = require("https");

const logger = require("./app/middleware/logger");

const app = express();

app.use(helmet());

global.__basedir = __dirname;

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Back-end de l'application web conformite." });
});

require("./app/routes/partner.routes")(app);
require("./app/routes/contact.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/rules/g_rule.routes")(app);
require("./app/routes/rules/rh_rule.routes")(app);
require("./app/routes/rules/pt_rule.routes")(app);
require("./app/routes/rules/a_rule.routes")(app);
require("./app/routes/rules/ca_rule.routes")(app);
require("./app/routes/rules/spe_rule.routes")(app);
require("./app/routes/rules/c_rule.routes")(app);
require("./app/routes/rules/adm_rule.routes")(app);
require("./app/routes/rules/se_rule.routes")(app);
require("./app/routes/rules/rf_rule.routes")(app);
require("./app/routes/rules/gi_rule.routes")(app);
require("./app/routes/rules/gca_rule.routes")(app);
require("./app/routes/rules/ie_rule.routes")(app);
require("./app/routes/rules/rgpd_rule.routes")(app);
require("./app/routes/rules/cd_rule.routes")(app);
require("./app/routes/rules/co_rule.routes")(app);
require("./app/routes/rules/tdt_rule.routes")(app);
require("./app/routes/file.routes")(app);

// set port, listen for requests
//const PORT = process.env.PORT || 8081;
//app.listen(PORT, () => {
//  logger.debug(`Server is running on port ${PORT}.`);
//});

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  )
  .listen(8081, function () {
    console.log(
      "Example app listening on port 3000! Go to https://localhost:3000/"
    );
  });
