import fileStructure from "../fileStructure.js";

const getPathContents = (currentDirectoryContents, path) => {
  const pathStack = [{ ...currentDirectoryContents }];
  const normalizedPathItems = [];
  for (let f of path) {
    if (f === "" || f === ".") continue;
    if (f === "..") {
      pathStack.pop();
      currentDirectoryContents = pathStack[pathStack.length - 1];
      normalizedPathItems.pop();
      continue;
    }

    if (currentDirectoryContents[f] !== undefined) {
      normalizedPathItems.push(f);
      currentDirectoryContents = { [f]: currentDirectoryContents[f] };
    } else if (currentDirectoryContents[f + "/"] !== undefined) {
      normalizedPathItems.push(f + "/");
      currentDirectoryContents = currentDirectoryContents[f + "/"];
    } else {
      return -1;
    }
    pathStack.push({ ...currentDirectoryContents });
  }
  return {
    content: currentDirectoryContents,
    path: "/" + normalizedPathItems.join(""),
  };
};

export default function ls(args) {
  if (args === undefined || args.length === 0) {
    args = ["/"];
  }

  const { content: currentDirectoryContents } = getPathContents(
    fileStructure["/"],
    (window.consolePath + args[0]).split("/")
  );
  if (currentDirectoryContents === -1) {
    return `ls: cannot access '${args[0]}': No such file or directory`;
  }

  if (typeof currentDirectoryContents === "string") {
    return currentDirectoryContents;
  }

  return Object.keys(currentDirectoryContents).join(" ");
}

export { getPathContents };
