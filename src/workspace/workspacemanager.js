import { readdir } from "fs/promises";
import { resolve, extname } from "path";
import Workspace from "./Workspace";

export async function createWorkspace(directory) {
  const markdownFiles = [];
  for await (const value of listFilesRecursive(directory, [
    ".md",
    ".markdown",
  ])) {
    markdownFiles.push(value);
  }

  return new Workspace(markdownFiles);
}

/**
 * Lists all files in a directory recursively, which have the given extension.
 * The extension matching is case in-sensitive.
 * @param {*} dir Directory to start the search
 * @param {*} extension Extension to filter for
 */
async function* listFilesRecursive(dir, extensions) {
  const topLevel = await readdir(dir, { withFileTypes: true });
  for (const child of topLevel) {
    const path = resolve(dir, child.name);
    console.log(path);
    if (child.isDirectory()) {
      yield* listFilesRecursive(path, extensions);
    } else if (extensions.includes(extname(child.name).toLowerCase())) {
      yield path;
    }
  }
}
