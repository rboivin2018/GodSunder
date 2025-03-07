import { Component } from "../../ecs/Component";

export class InteractiveComponent extends Component {
  constructor(options = {}) {
    super("interactive");
    this.onClick = options.onClick || null;
    this.onHover = options.onHover || null;
    this.onHoverOut = options.onHoverOut || null;
    this.cursor = options.cursor || "pointer";
  }
}
