import fileStructure from "../fileStructure.js";
import { getPathContents } from "./ls.js";

export default function cd(args) {
  if (args.length === 0) {
    window.consolePath = "/";
    return "";
  }
  if (args.length > 1) {
    return `cd: too many arguments`;
  }

  args[0] = window.consolePath + args[0];

  let { content: currentDirectoryContents, path: normalizedPath } =
    getPathContents(fileStructure["/"], args[0].split("/"));

  if (currentDirectoryContents === -1) {
    return `cd: no such file or directory: ${normalizedPath}`;
  }

  if (normalizedPath.slice(-1) !== "/") {
    return `cd: ${normalizedPath}: Not a directory`;
  }

  window.consolePath = normalizedPath;
  return "";
}
