import { SkillComponent } from "./SkillComponent";

export class FireballSkill extends SkillComponent {
  constructor(options = {}) {
    super({
      name: "Fireball",
      description:
        "Launches a ball of fire that deals damage to a single target",
      cooldown: options.cooldown || 3000,
      manaCost: options.manaCost || 10,
      damage: options.damage || 20,
      range: options.range || 5,
      targeting: "single",
      icon: options.icon || "fireball-icon",
      animation: options.animation || "fireball-animation",
      sound: options.sound || "fireball-sound",
      ...options,
    });
  }
}
