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
      iconKey: options.iconKey || "fireball-icon",
      animationKey: options.animationKey || "fireball-animation",
      soundKey: options.soundKey || "fireball-sound",
      ...options,
    });

    // Propriétés spécifiques à la boule de feu
    this.speed = options.speed || 300;
    this.explosionRadius = options.explosionRadius || 50;
    this.burnDuration = options.burnDuration || 0; // Effet DoT en ms (0 = pas d'effet)
    this.burnDamage = options.burnDamage || 0; // Dégâts par tick
  }

  // Méthode spécifique pour calculer les dégâts avec bonus/malus élémentaires
  calculateDamage(caster, target) {
    let finalDamage = this.damage;

    // Exemple: bonus de dégâts basé sur les stats du lanceur
    if (caster.intelligence) {
      finalDamage += caster.intelligence * 0.5;
    }

    // Exemple: résistance au feu de la cible
    if (target.fireResistance) {
      finalDamage *= 1 - target.fireResistance;
    }

    return Math.max(1, Math.round(finalDamage));
  }
}
