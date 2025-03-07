export class Enemy {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.maxHealth = 100;
    this.health = 100;

    // Créer le sprite du joueur
    this.sprite = scene.physics.add.sprite(x, y, "enemy");

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

  update(time, delta) {}
}
