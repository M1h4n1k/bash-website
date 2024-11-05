import commands from "./commands.js";

const history = [];
const displayedHistory = [];
let currentCommandIndex = 0; // used for arrows up and down

const USER = "guest@mk";
window.consolePath = "/";
let prevKey = undefined;

const htmlEncode = (str) => {
  return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
};

const wrapLinksInAnchorTags = (text) => {
  const urlPattern = /(\bhttps?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
};

const updateDisplayWithNewHistory = () => {
  document.getElementById("path").innerText = window.consolePath;
  document.getElementById("history").innerHTML = displayedHistory
    .map((h) => {
      const formattedOutput = wrapLinksInAnchorTags(
        h[1].replace(/\n/g, "<br>")
      );

      return `<span><span class="user">${USER}</span>:<span class="path">${
        h[2]
      }</span>$ ${h[0]}${h[1] !== "" ? "<br>" : ""}${formattedOutput}</span>`;
    })
    .join("<br>");
};

document.addEventListener("keydown", () => {
  document.getElementById("input").focus();
});

document.addEventListener("click", () => {
  document.getElementById("input").focus();
});

document.getElementById("input").addEventListener("change", () => {
  document.getElementById("input").size =
    document.getElementById("input").value.length + 1;
});

document.getElementById("input").addEventListener("keydown", (event) => {
  const currentPath = window.consolePath;

  let currentInput = document.getElementById("input").value;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (currentCommandIndex < history.length) {
      currentCommandIndex++;
      document.getElementById("input").value =
        history[history.length - currentCommandIndex][0];
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (currentCommandIndex > 1) {
      currentCommandIndex--;
      document.getElementById("input").value =
        history[history.length - currentCommandIndex][0];
    } else {
      document.getElementById("input").value = "";
      currentCommandIndex = 0;
    }
  }

  if (event.key === "c" && event.ctrlKey) {
    displayedHistory.push([htmlEncode(currentInput + "^C"), "", currentPath]);
    updateDisplayWithNewHistory();
    document.getElementById("input").value = "";
    currentCommandIndex = 0;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    let output = "";
    const command = currentInput.trim().split(" ")[0];
    const args = currentInput.trim().split(" ").slice(1);

    if (command !== "" && commands[command] === undefined) {
      output = `${command}: command not found`;
    } else if (command !== "") {
      try {
        output = commands[command](args);
      } catch (e) {
        output = e.message;
      }
    }
    if (output === -1) {
      displayedHistory.length = 0;
    } else {
      displayedHistory.push([
        htmlEncode(currentInput),
        htmlEncode(output),
        currentPath,
      ]);
    }
    history.push([currentInput, output]);
    updateDisplayWithNewHistory();
    document.getElementById("input").value = "";
    currentCommandIndex = 0;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    const lastWordStart =
      currentInput.lastIndexOf(" ", event.target.selectionStart) + 1;
    const inputPath = currentInput.slice(lastWordStart);
    let matchedEntities;
    if (lastWordStart === 0) {
      matchedEntities = Object.keys(commands).filter((e) =>
        e.startsWith(inputPath.split("/").pop())
      );
    } else {
      const entities = commands["ls"]([
        inputPath.split("/").slice(0, -1).join("/"),
      ]);

      matchedEntities = entities
        .split(" ")
        .filter((e) => e.startsWith(inputPath.split("/").pop()));
    }

    if (matchedEntities.length === 1) {
      if (inputPath === "") {
        document.getElementById("input").value =
          currentInput.slice(0, event.target.selectionStart) +
          matchedEntities[0] +
          currentInput.slice(event.target.selectionStart);
      } else {
        const newInputPath = inputPath.split("/").slice(0, -1);
        newInputPath.push(matchedEntities[0]);
        document.getElementById("input").value = currentInput.replace(
          inputPath,
          newInputPath.join("/")
        );
      }
    } else if (matchedEntities.length > 1 && prevKey === "Tab") {
      displayedHistory.push([
        htmlEncode(currentInput),
        htmlEncode(matchedEntities.join(" ")),
        currentPath,
      ]);
      updateDisplayWithNewHistory();
    }
  }

  document.getElementById("input").size =
    document.getElementById("input").value.length + 1;
  //   document.getElementById("input").innerHTML = htmlEncode(currentInput);
  prevKey = event.key;
});
