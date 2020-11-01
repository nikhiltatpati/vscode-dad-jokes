const vscode = require("vscode");
const axios = require("axios");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  function hasConfig(key) {
    const conf = this.getConfig(key);
    return conf !== null && conf !== undefined && conf !== "";
  }

  function getConfig(key) {
    return this._config.has(`dad-jokes.${key}`)
      ? this._config.get(`dad-jokes.${key}`)
      : null;
  }

  async function setConfig(key, value) {
    return await this._config.update(
      `dad-jokes.${key}`,
      value,
      vscode.ConfigurationTarget.Global
    );
  }

  const duration = vscode.workspace
    .getConfiguration()
    .get("dad-jokes.duration");

  let time = duration.split(" ");

  function getMillis(arr) {
    let duration;
    if (arr[1] === "min") {
      duration = 1000 * 60 * arr[0];
    } else if (arr[1] === "hr") {
      duration = 1000 * 60 * 60 * arr[0];
    }
    return duration;
  }

  console.log(getMillis(time));

  try {
    axios
      .get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      })
      .then((result) => {
        vscode.window.showInformationMessage(result.data.joke);
      });
  } catch (e) {
    console.error(e);
  }

  setInterval(async function () {
    try {
      axios
        .get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        })
        .then((result) => {
          vscode.window.showInformationMessage(result.data.joke);
        });
    } catch (e) {
      console.error(e);
    }
  }, getMillis(time));

  let disposable = vscode.commands.registerCommand(
    "dad-jokes.randomJoke",
    function () {
      vscode.window.showInformationMessage("🎉Hurray!!! Dad Jokes is active🎉");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

