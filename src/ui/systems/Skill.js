import { System } from "../ecs/System";

export class SkillUISystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
    this.requiresComponents = ["skillUI"];
  }

  init() {
    // Créer les éléments visuels pour chaque entité
    this.entities.forEach((entity) => {
      const skillUI = entity.getComponent("skillUI");
      if (skillUI) {
        skillUI.createVisuals(this.scene);
      }
    });
  }

  update(time, delta) {
    // Si le gestionnaire de compétences n'est pas disponible, on ne peut pas mettre à jour
    if (!this.scene.skillManager) return;

    this.entities.forEach((entity) => {
      const skillUI = entity.getComponent("skillUI");

      if (skillUI && skillUI.skillId) {
        // Récupérer les informations de la compétence
        const skillData = this.scene.skillManager.getSkillById(skillUI.skillId);

        if (skillData && skillData.skill) {
          // Mettre à jour l'affichage du cooldown
          const cooldownPercentage = skillData.skill.getCooldownPercentage();
          skillUI.updateCooldownVisual(cooldownPercentage);
        }
      }
    });
  }

  onEntityAdded(entity) {
    super.onEntityAdded(entity);

    // Créer les éléments visuels pour la nouvelle entité
    const skillUI = entity.getComponent("skillUI");
    if (skillUI) {
      skillUI.createVisuals(this.scene);
    }
  }

  onEntityRemoved(entity) {
    // Nettoyer les ressources visuelles
    const skillUI = entity.getComponent("skillUI");
    if (skillUI) {
      skillUI.destroy();
    }

    super.onEntityRemoved(entity);
  }
}
