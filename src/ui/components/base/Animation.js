import { Component } from "../../ecs/Component";

export class AnimationComponent extends Component {
  constructor(options = {}) {
    super("animation");
    this.animations = options.animations || {};
    this.currentAnimation = options.currentAnimation || null;
  }
}
