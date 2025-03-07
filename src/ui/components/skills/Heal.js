import { SkillComponent } from "./SkillComponent";

export class HealSkill extends SkillComponent {
  constructor(options = {}) {
    super({
      name: "Heal",
      description: "Heals the caster or a friendly target",
      cooldown: options.cooldown || 5000,
      manaCost: options.manaCost || 15,
      healing: options.healing || 30,
      range: options.range || 3,
      targeting: options.targeting || "self",
      icon: options.icon || "heal-icon",
      animation: options.animation || "heal-animation",
      sound: options.sound || "heal-sound",
      ...options,
    });
  }
}
