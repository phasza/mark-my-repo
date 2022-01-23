import os from "os";
import path from "path";
import { createWorkspace } from "../workspacemanager";
import { test, expect } from "@jest/globals";
import { mkdirSync, mkdtempSync, writeFileSync } from "fs";

test("should be able to create workspace for empty dir", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  const workspace = await createWorkspace(directory);
  expect(workspace.files).toHaveLength(0);
});

test("should be able to create workspace from a valid dir", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "mark-my-repo-"));
  /*
    Directory structure:
        src/
            docs/
                README.md
                something.MD
                notAMarkdown.docx
            test/java/
                testing.md
                /com/package/
                    MainTest.java
            /main/java/com/package/
                Main.java
                README.markdown
  */
  const expectedFiles = [];
  const notExpectedFiles = [];

  const src = path.join(directory, "src");
  mkdirSync(src);

  const docs = path.join(src, "docs");
  mkdirSync(docs);
  expectedFiles.push(
    path.join(docs, "README.md"),
    path.join(docs, "something.MD")
  );
  notExpectedFiles.push(path.join(docs, "notAMarkdown.docx"));

  const tests = path.join(src, "test", "java");
  mkdirSync(tests, { recursive: true });
  expectedFiles.push(path.join(tests, "testing.md"));
  const testPackage = path.join(tests, "com", "package");
  mkdirSync(testPackage, { recursive: true });
  notExpectedFiles.push(path.join(testPackage, "MainTest.java"));

  const main = path.join(src, "main", "java", "com", "package");
  mkdirSync(main, { recursive: true });
  expectedFiles.push(path.join(main, "README.markdown"));
  notExpectedFiles.push(path.join(main, "Main.java"));

  [...expectedFiles, ...notExpectedFiles].forEach((i) => writeFileSync(i, ""));

  const workspace = await createWorkspace(directory);
  expect(workspace.files).toEqual(expect.arrayContaining(expectedFiles));
});
