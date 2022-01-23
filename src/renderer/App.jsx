import * as React from "react";
import * as ReactDOM from "react-dom";

import { MarkdownContainer } from "./MarkdownContainer";
import { NavigationMenu } from "./NavigationMenu";

const flexStyle = {
  display: "flex",
};

const App = () => {
  return (
    <div style={flexStyle}>
      <NavigationMenu />
      <MarkdownContainer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
