import { Component } from "../../ecs/Component";

export class SizeComponent extends Component {
  constructor(width = 100, height = 50) {
    super("size");
    this.width = width;
    this.height = height;
  }
}
