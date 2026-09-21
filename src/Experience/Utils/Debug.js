import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    this.ui = new Pane({
      title: "DC Motor",
    });

    // #bett drops the guided chapters for booth demos. With only one page
    // left there is nothing to tab between, so the tools sit straight on the
    // pane and everything moves up a level.
    this.isBett = location.hash === "#bett";

    if (this.isBett) {
      this.tab = null;
      this.learningPage = null;
      this.toolsPage = this.ui;
    } else {
      this.tab = this.ui.addTab({
        pages: [{ title: "Learning" }, { title: "Tools" }],
      });
      this.learningPage = this.tab.pages[0];
      this.toolsPage = this.tab.pages[1];
    }
  }
}
