const request = require("request-promise-native");

const lookupWord = word =>
  new Promise((resolve, reject) => {
    const Dictionary = require("oxford-dictionary-api");
    const app_id = "32e4a1cc";
    const app_key = "fb53f971972e49dbe08eda72e826e571";
    const dict = new Dictionary(app_id, app_key);

    dict.find(word, function(error, data) {
      if (error) reject;
      if (data) {
        resolve(data.results[0].lexicalEntries);
      } else {
        data = {
          results: [
            {
              lexicalEntries: []
            }
          ]
        };
        resolve(data.results[0].lexicalEntries);
      }
    });
  });

module.exports = lookupWord;
