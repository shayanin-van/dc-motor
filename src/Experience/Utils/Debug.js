import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    this.ui = new Pane({
      title: "DC Motor",
    });

    this.tab = this.ui.addTab({
      pages: [{ title: "Learning" }, { title: "Tools" }],
    });
  }
}
