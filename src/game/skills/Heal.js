// src/game/skills/HealSkill.js
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
      iconKey: options.iconKey || "heal-icon",
      animationKey: options.animationKey || "heal-animation",
      soundKey: options.soundKey || "heal-sound",
      ...options,
    });

    // Propriétés spécifiques aux soins
    this.bonusRegenerationDuration = options.bonusRegenerationDuration || 0;
    this.regenerationPerSecond = options.regenerationPerSecond || 0;
  }

  // Méthode spécifique pour calculer les soins avec bonus
  calculateHealing(caster, target) {
    let finalHealing = this.healing;

    // Exemple: bonus de soins basé sur les stats du lanceur
    if (caster.wisdom) {
      finalHealing += caster.wisdom * 0.7;
    }

    // Exemple: bonus de soins reçus de la cible
    if (target.healingReceived) {
      finalHealing *= 1 + target.healingReceived;
    }

    return Math.round(finalHealing);
  }
}
