export class SkillComponent {
  constructor(options = {}) {
    this.id = options.id || crypto.randomUUID();
    this.name = options.name || "Unnamed Skill";
    this.description = options.description || "";
    this.cooldown = options.cooldown || 0; // Temps en ms
    this.currentCooldown = 0;
    this.manaCost = options.manaCost || 0;
    this.damage = options.damage || 0;
    this.healing = options.healing || 0;
    this.range = options.range || 1;
    this.areaOfEffect = options.areaOfEffect || 0;
    this.targeting = options.targeting || "single"; // 'single', 'area', 'self'
    this.effects = options.effects || []; // Effets supplémentaires

    // Références aux assets (sans logique d'affichage)
    this.iconKey = options.iconKey || null;
    this.animationKey = options.animationKey || null;
    this.soundKey = options.soundKey || null;

    // Callbacks pour les événements de jeu
    this.onCast = options.onCast || null;
    this.onHit = options.onHit || null;
  }

  isReady() {
    return this.currentCooldown <= 0;
  }

  cast(caster, target) {
    if (!this.isReady()) {
      return { success: false, reason: "cooldown" };
    }

    if (caster.mana < this.manaCost) {
      return { success: false, reason: "not_enough_mana" };
    }

    // Réduire le mana du lanceur
    caster.mana -= this.manaCost;

    // Mettre la compétence en cooldown
    this.currentCooldown = this.cooldown;

    // Exécuter le callback de cast si disponible
    if (this.onCast) {
      this.onCast(caster, target, this);
    }

    return { success: true };
  }

  update(delta) {
    // Réduire le cooldown en fonction du temps écoulé
    if (this.currentCooldown > 0) {
      this.currentCooldown -= delta;
      if (this.currentCooldown < 0) {
        this.currentCooldown = 0;
      }
    }

    return { cooldownUpdated: this.currentCooldown > 0 };
  }

  getCooldownPercentage() {
    if (this.cooldown === 0) return 0;
    return Math.max(0, Math.min(1, this.currentCooldown / this.cooldown));
  }

  getRemainingCooldownSeconds() {
    return Math.ceil(this.currentCooldown / 1000);
  }
}
