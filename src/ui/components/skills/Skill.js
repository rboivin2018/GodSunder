// src/ui/components/skills/SkillUIComponent.js
import { Component } from "../../ecs/Component";

export class SkillUIComponent extends Component {
  constructor(options = {}) {
    super("skillUI");
    this.skillId = options.skillId || null;
    this.position = options.position || { x: 0, y: 0 };
    this.size = options.size || { width: 50, height: 50 };
    this.iconTexture = options.iconTexture || null;
    this.iconFrame = options.iconFrame || null;
    this.showCooldown =
      options.showCooldown !== undefined ? options.showCooldown : true;
    this.showTooltip =
      options.showTooltip !== undefined ? options.showTooltip : true;
    this.interactive =
      options.interactive !== undefined ? options.interactive : true;
    this.onClickCallback = options.onClickCallback || null;

    // Éléments visuels (références aux objets Phaser)
    this.container = null;
    this.iconSprite = null;
    this.cooldownOverlay = null;
    this.cooldownText = null;
    this.tooltipContainer = null;
  }

  // Création des éléments visuels dans la scène
  createVisuals(scene) {
    // Créer un conteneur pour regrouper les éléments visuels
    this.container = scene.add.container(this.position.x, this.position.y);

    // Créer le fond de l'icône
    const background = scene.add.rectangle(
      0,
      0,
      this.size.width,
      this.size.height,
      0x333333,
    );
    background.setOrigin(0.5);
    this.container.add(background);

    // Créer l'icône de la compétence
    if (this.iconTexture) {
      this.iconSprite = scene.add.sprite(
        0,
        0,
        this.iconTexture,
        this.iconFrame,
      );
      this.iconSprite.setDisplaySize(this.size.width - 4, this.size.height - 4);
      this.container.add(this.iconSprite);
    }

    // Créer l'overlay de cooldown (masque semi-transparent)
    this.cooldownOverlay = scene.add.graphics();
    this.container.add(this.cooldownOverlay);

    // Créer le texte de cooldown
    this.cooldownText = scene.add.text(0, 0, "", {
      fontSize: "16px",
      fill: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.cooldownText.setOrigin(0.5);
    this.cooldownText.setVisible(false);
    this.container.add(this.cooldownText);

    // Rendre l'icône interactive si nécessaire
    if (this.interactive) {
      background.setInteractive({ useHandCursor: true });
      background.on("pointerdown", () => {
        if (this.onClickCallback) {
          this.onClickCallback();
        }
      });

      // Effets de survol
      background.on("pointerover", () => {
        background.setFillStyle(0x555555);
        if (this.showTooltip) {
          this.showTooltipVisual(scene);
        }
      });

      background.on("pointerout", () => {
        background.setFillStyle(0x333333);
        if (this.tooltipContainer) {
          this.tooltipContainer.setVisible(false);
        }
      });
    }
  }

  // Affichage du tooltip
  showTooltipVisual(scene) {
    // Si le skill manager n'est pas disponible, on ne peut pas récupérer les infos
    if (!scene.skillManager) return;

    // Récupérer les informations de la compétence
    const skillData = scene.skillManager.getSkillById(this.skillId);
    if (!skillData) return;

    // Créer le tooltip s'il n'existe pas
    if (!this.tooltipContainer) {
      this.tooltipContainer = scene.add.container(
        this.position.x,
        this.position.y - 100,
      );

      // Fond du tooltip
      const bg = scene.add.rectangle(0, 0, 200, 120, 0x000000, 0.8);
      bg.setOrigin(0.5, 0.5);
      this.tooltipContainer.add(bg);

      // Titre
      const titleText = scene.add.text(0, -45, skillData.skill.name, {
        fontSize: "16px",
        fill: "#ffffff",
        fontStyle: "bold",
      });
      titleText.setOrigin(0.5, 0.5);
      this.tooltipContainer.add(titleText);

      // Description
      const descText = scene.add.text(0, -15, skillData.skill.description, {
        fontSize: "12px",
        fill: "#cccccc",
        wordWrap: { width: 180 },
      });
      descText.setOrigin(0.5, 0.5);
      this.tooltipContainer.add(descText);

      // Coût en mana
      const manaText = scene.add.text(
        0,
        25,
        `Mana: ${skillData.skill.manaCost}`,
        {
          fontSize: "12px",
          fill: "#00aaff",
        },
      );
      manaText.setOrigin(0.5, 0.5);
      this.tooltipContainer.add(manaText);

      // Cooldown
      const cdText = scene.add.text(
        0,
        45,
        `Cooldown: ${skillData.skill.cooldown / 1000}s`,
        {
          fontSize: "12px",
          fill: "#ffaa00",
        },
      );
      cdText.setOrigin(0.5, 0.5);
      this.tooltipContainer.add(cdText);
    }

    this.tooltipContainer.setVisible(true);
  }

  // Mise à jour de l'affichage du cooldown
  updateCooldownVisual(percentage) {
    if (!this.showCooldown || !this.cooldownOverlay) return;

    this.cooldownOverlay.clear();

    if (percentage > 0) {
      // Dessiner un overlay semi-transparent pour représenter le cooldown
      this.cooldownOverlay.fillStyle(0x000000, 0.6);

      // Dessiner une forme en secteur pour représenter le pourcentage de cooldown
      const angle = 360 * percentage;
      this.cooldownOverlay.slice(
        0,
        0,
        this.size.width / 2,
        Phaser.Math.DegToRad(0),
        Phaser.Math.DegToRad(angle),
        true,
      );
      this.cooldownOverlay.fillPath();

      // Afficher le texte du cooldown
      const remainingSeconds = Math.ceil((percentage * this.cooldown) / 1000);
      this.cooldownText.setText(remainingSeconds.toString());
      this.cooldownText.setVisible(true);

      // Griser l'icône
      if (this.iconSprite) {
        this.iconSprite.setAlpha(0.5);
      }
    } else {
      // Cacher le texte du cooldown et restaurer l'icône
      this.cooldownText.setVisible(false);
      if (this.iconSprite) {
        this.iconSprite.setAlpha(1);
      }
    }
  }

  // Destruction des ressources visuelles
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
    if (this.tooltipContainer) {
      this.tooltipContainer.destroy();
    }
  }
}
