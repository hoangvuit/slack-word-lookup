const Express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const request = require('request');

const lookupWord = require("./word-lookup");
const slashCommandFactory = require("./slash-command");

const app = new Express();
app.use(bodyParser.urlencoded({ extended: true }));

const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.PORT;

if (!slackToken) {
  console.error("missing environment variables SLACK_TOKEN");
  process.exit(1);
}

const port = PORT || 80;

const slashCommand = slashCommandFactory(lookupWord, slackToken);

app.post("/", (req, res) => {
  slashCommand(req.body)
    .then(result => {
      return res.json(result);
    })
    .catch(console.error);
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/auth/redirect", (req, res) => {
  var options = {
    uri:
      "https://slack.com/api/oauth.access?code=" +
      req.query.code +
      "&client_id=" +
      process.env.CLIENT_ID +
      "&client_secret=" +
      process.env.CLIENT_SECRET,
    method: "GET"
  };
  request(options, (error, response, body) => {
    var JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      console.log(JSONresponse);
      res
        .send("Error encountered: \n" + JSON.stringify(JSONresponse))
        .status(200)
        .end();
    } else {
      console.log(JSONresponse);
      res.sendFile(path.join(__dirname + "/auth-success.html"));
    }
  });
});

app.get("/assets/stylesheets/:file", function(req, res) {
  res.contentType("text/css");
  res.sendFile(path.join(__dirname + "/assets/stylesheets/" + req.params.file));
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
