const Express = require("express");
const bodyParser = require("body-parser");
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

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
