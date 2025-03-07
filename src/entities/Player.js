export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.maxHealth = 100;
    this.health = 100;
    this.maxMana = 50;
    this.mana = 50;

    // Créer le sprite du joueur
    this.sprite = scene.physics.add.sprite(x, y, "player");

    // Initialiser les animations, etc.
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }

    // Afficher l'effet de dégâts, mettre à jour l'UI, etc.
  }

  heal(amount) {
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    // Afficher l'effet de guérison, mettre à jour l'UI, etc.
  }

  update(time, delta) {
    // Régénérer du mana avec le temps
    if (this.mana < this.maxMana) {
      this.mana += 0.01 * delta; // Régénère 10 mana par seconde
      if (this.mana > this.maxMana) {
        this.mana = this.maxMana;
      }
    }

    // Autres logiques de mise à jour
  }
}
