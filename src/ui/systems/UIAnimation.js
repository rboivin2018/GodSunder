import { System } from "../ecs/System";

export class UIAnimationSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
    this.requiresComponents = ["animation", "ui"];
  }

  update(time, delta) {
    this.entities.forEach((entity) => {
      const animation = entity.getComponent("animation");

      if (animation && animation.currentAnimation) {
        // Logique d'animation basée sur le temps
        // Implémentation selon les besoins spécifiques
      }
    });
  }
}
