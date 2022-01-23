import os from "os";
import path from "path";
import { Buffer } from "buffer";
import { test, expect } from "@jest/globals";
import {
  closeSync,
  existsSync,
  mkdtempSync,
  openSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from "fs";
import Workspace from "../Workspace";
import MarkdownIt from "markdown-it";

test("should be able to parse markdown content", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  const markdownFile = path.join(directory, "testFile.md");

  const markdownContent = `
  # This is a markdown file
  <br>
  ## **With a subtitle**
  > And some note
`;
  writeFileSync(markdownFile, markdownContent);

  const workspace = new Workspace();
  const parsedContent = workspace.getFileContent(markdownFile);

  const renderer = new MarkdownIt();
  expect(parsedContent).toEqual(renderer.render(markdownContent));
});

test("should be able to cache file content", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  const markdownFile = path.join(directory, "testFile.md");
  const markdownContent = "A";
  writeFileSync(markdownFile, markdownContent);

  const workspace = new Workspace();
  const renderer = new MarkdownIt();
  const expectedContent = renderer.render(markdownContent);
  const parsedContent = workspace.getFileContent(markdownFile);
  expect(parsedContent).toEqual(expectedContent);

  unlinkSync(markdownFile);
  expect(existsSync(markdownFile)).toEqual(false);

  const nextContent = workspace.getFileContent(markdownFile);
  expect(parsedContent).toEqual(expectedContent);
});

test("should be able to handle empty file", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  const markdownFile = path.join(directory, "testFile.md");
  writeFileSync(markdownFile, "");
  const workspace = new Workspace();
  const parsedContent = workspace.getFileContent(markdownFile);
  expect(parsedContent).toEqual("");
});

test("should be able to handle invalid file content", () => {
  const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  const markdownFile = path.join(directory, "testFile.md");

  const fileDescriptor = openSync(markdownFile, "w", 438);
  writeSync(fileDescriptor, buf, 0, buf.length, 0);
  closeSync(fileDescriptor);

  const workspace = new Workspace();
  const parsedContent = workspace.getFileContent(markdownFile);
  expect(parsedContent).toEqual(
    `<p>buffer</p>
`
  );
});

test("should be able to handle not existing file", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  const markdownFile = path.join(directory, "testFile.md");
  const workspace = new Workspace();
  expect(() => workspace.getFileContent(markdownFile)).toThrow("ENOENT");
});

test("should return file list", () => {
  const expectedFiles = [
    "file1.md",
    "file2.markdown",
    "file3.MD",
    "file4.MARKDOWN",
  ];
  const workspace = new Workspace(expectedFiles);
  expect(workspace.files).toEqual(expectedFiles);
});
