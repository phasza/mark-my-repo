import fs from "fs";
import MarkdownIt from "markdown-it";

class Workspace {
  constructor(files) {
    this._files = files;
    this.fileContentMap = new Map();
    this.renderer = new MarkdownIt();
  }

  get files() {
    return this._files;
  }

  getFileContent(file) {
    if (this.fileContentMap.has(file)) {
      return this.fileContentMap.get(file);
    }

    const content = this.renderer.render(fs.readFileSync(file, "utf8"));
    this.fileContentMap.set(file, content);
    return content;
  }
}

export default Workspace;
