const vscode = require("vscode");
const axios = require("axios");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  

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

