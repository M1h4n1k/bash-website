import fileStructure from "../fileStructure.js";
import { getPathContents } from "./ls.js";

export default function cd(args) {
  if (args.length === 0) {
    return `cat: missing operand`;
  }
  if (args.length > 1) {
    return `cat: too many arguments`;
  }

  args[0] = window.consolePath + args[0];

  let { content: currentDirectoryContents, path: normalizedPath } =
    getPathContents(fileStructure["/"], args[0].split("/"));
  if (currentDirectoryContents === -1) {
    return `cat: no such file or directory: ${args[0]}`;
  }
  if (normalizedPath.slice(-1) === "/") {
    return `cat: ${args[0]}: Is a directory`;
  }

  return currentDirectoryContents[Object.keys(currentDirectoryContents)[0]];
}
