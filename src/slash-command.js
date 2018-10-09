const createErrorAttachment = error => ({
  color: "danger",
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ["text"]
});

const createSuccessAttachment = result => ({
  color: "good",
  text: `*${result.lexicalCategory}*:  ${
    result.entries[0].senses[0].definitions[0]
  }`,
  mrkdwn_in: ["text"]
});

const createWordNotFoundAttachment = () => ({
  color: "danger",
  text: "No definitions found",
  mrkdwn_in: ["text"]
});

const createAttachment = result => {
  if (result.constructor === Error) {
    return createErrorAttachment(result);
  }

  return createSuccessAttachment(result);
};

const slashCommandFactory = (lookupWord, slackToken) => body =>
  new Promise((resolve, reject) => {
    if (!body) {
      return resolve({
        text: "",
        attachments: [createErrorAttachment(new Error("Invalid body"))]
      });
    }

    if (slackToken !== body.token) {
      return resolve({
        text: "",
        attachments: [createErrorAttachment(new Error("Invalid token"))]
      });
    }

    const word = body.text;

    lookupWord(word).then(result => {
      if (result.length == 0) {
        return resolve({
          text: word,
          attachments: [createWordNotFoundAttachment()]
        });
      }

      return resolve({
        text: word,
        attachments: result.map(createAttachment)
      });
    });
  });

module.exports = slashCommandFactory;
