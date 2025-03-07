import { ECSManager } from "../ui/ecs/ECSManager";
import { SkillUISystem } from "../ui/systems/SkillUISystem";
import { SkillUIComponent } from "../ui/components/skills/SkillUIComponent";

export class SkillManager {
  constructor(scene) {
    this.scene = scene;
    this.ecs = new ECSManager(scene);

    // Ajouter le système UI pour les compétences
    this.ecs.addSystem("skillUI", new SkillUISystem(scene));

    // Map pour stocker les références aux compétences
    this.skills = new Map();
  }

  /**
   * Crée une nouvelle compétence
   * @param {SkillComponent} skill - Instance de compétence
   * @param {Object} owner - Propriétaire de la compétence
   * @param {Object} uiOptions - Options d'interface utilisateur (optionnel)
   * @returns {string} ID de la compétence
   */
  registerSkill(skill, owner, uiOptions = null) {
    // Stocker la compétence et son propriétaire
    this.skills.set(skill.id, {
      skill,
      owner,
      entity: null,
    });

    // Créer une entité UI si des options UI sont fournies
    if (uiOptions) {
      const entity = this.ecs.createEntity();

      // Ajouter le composant UI pour la compétence
      entity.addComponent(
        new SkillUIComponent({
          skillId: skill.id,
          position: uiOptions.position || { x: 0, y: 0 },
          size: uiOptions.size || { width: 50, height: 50 },
          iconTexture: skill.iconKey,
          showCooldown: uiOptions.showCooldown,
          showTooltip: uiOptions.showTooltip,
          interactive: uiOptions.interactive,
          onClickCallback: () =>
            this.useSkill(skill.id, uiOptions.target || owner),
        }),
      );

      // Mettre à jour la référence à l'entité
      this.skills.get(skill.id).entity = entity;

      // Notifier le gestionnaire ECS qu'une entité a été modifiée
      this.ecs.entityComponentChanged(entity);
    }

    return skill.id;
  }

  /**
   * Récupère une compétence par son ID
   * @param {string} skillId - ID de la compétence
   * @returns {Object|null} Données de la compétence ou null si non trouvée
   */
  getSkillById(skillId) {
    return this.skills.get(skillId) || null;
  }

  /**
   * Utilise une compétence sur une cible
   * @param {string} skillId - ID de la compétence
   * @param {Object} target - Cible de la compétence
   * @returns {Object} Résultat de l'utilisation de la compétence
   */
  useSkill(skillId, target) {
    const skillData = this.skills.get(skillId);

    if (!skillData) {
      console.warn(`Skill with ID ${skillId} not found.`);
      return { success: false, reason: "skill_not_found" };
    }

    const skill = skillData.skill;
    const owner = skillData.owner;

    return skill.cast(owner, target);
  }

  /**
   * Met à jour toutes les compétences
   * @param {number} time - Temps actuel
   * @param {number} delta - Temps écoulé depuis la dernière mise à jour
   */
  update(time, delta) {
    // Mettre à jour les compétences
    this.skills.forEach((skillData) => {
      if (skillData.skill) {
        skillData.skill.update(delta);
      }
    });

    // Mettre à jour le système ECS (UI)
    this.ecs.update(time, delta);
  }

  /**
   * Détruit le gestionnaire et libère les ressources
   */
  destroy() {
    // Nettoyer les entités ECS
    if (this.ecs) {
      this.ecs.destroy();
    }

    // Vider la map des compétences
    this.skills.clear();
  }
}
