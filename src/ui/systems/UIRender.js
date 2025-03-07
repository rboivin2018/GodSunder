import { System } from "../ecs/System";
import Phaser from "phaser";

export class UIRenderSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
    this.requiresComponents = ["ui"];
  }

  update(time, delta) {
    this.entities.forEach((entity) => {
      const ui = entity.getComponent("ui");

      // Vérifier si l'entité a déjà des objets Phaser
      let container = entity.getGameObject("container");

      // Créer un conteneur si nécessaire
      if (!container) {
        const position = entity.getComponent("position") || {
          x: 0,
          y: 0,
        };
        container = this.scene.add.container(position.x, position.y);
        entity.addGameObject("container", container);

        // Créer l'arrière-plan si un style est défini
        const style = entity.getComponent("style");
        if (style) {
          const size = entity.getComponent("size") || {
            width: 100,
            height: 50,
          };
          const graphics = this.scene.add.graphics();

          graphics.fillStyle(style.backgroundColor, style.backgroundAlpha);

          if (style.borderRadius > 0) {
            graphics.fillRoundedRect(
              0,
              0,
              size.width,
              size.height,
              style.borderRadius,
            );
          } else {
            graphics.fillRect(0, 0, size.width, size.height);
          }

          if (style.borderWidth > 0) {
            graphics.lineStyle(style.borderWidth, style.borderColor);

            if (style.borderRadius > 0) {
              graphics.strokeRoundedRect(
                0,
                0,
                size.width,
                size.height,
                style.borderRadius,
              );
            } else {
              graphics.strokeRect(0, 0, size.width, size.height);
            }
          }

          entity.addGameObject("background", graphics);
          container.add(graphics);
        }

        // Ajouter le texte si défini
        const textComp = entity.getComponent("text");
        if (textComp) {
          const size = entity.getComponent("size") || {
            width: 100,
            height: 50,
          };
          const padding = entity.getComponent("style")?.padding || 0;

          const textConfig = {
            fontFamily: textComp.fontFamily,
            fontSize: `${textComp.fontSize}px`,
            color: textComp.color,
            align: textComp.align,
            stroke: textComp.stroke,
            strokeThickness: textComp.strokeThickness,
          };

          if (textComp.wordWrap) {
            textConfig.wordWrap = {
              width: size.width - padding * 2,
            };
          }

          const text = this.scene.add.text(
            padding,
            padding,
            textComp.content,
            textConfig,
          );

          entity.addGameObject("text", text);
          container.add(text);
        }

        // Ajouter le sprite si défini
        const spriteComp = entity.getComponent("sprite");
        if (spriteComp && spriteComp.texture) {
          const sprite = this.scene.add.sprite(
            0,
            0,
            spriteComp.texture,
            spriteComp.frame,
          );
          sprite.setOrigin(spriteComp.origin.x, spriteComp.origin.y);
          sprite.setTint(spriteComp.tint);
          sprite.setAlpha(spriteComp.alpha);
          sprite.setVisible(spriteComp.visible);

          entity.addGameObject("sprite", sprite);
          container.add(sprite);
        }

        // Configurer l'interactivité
        const interactive = entity.getComponent("interactive");
        if (interactive) {
          const size = entity.getComponent("size") || {
            width: 100,
            height: 50,
          };
          const hitArea = new Phaser.Geom.Rectangle(
            0,
            0,
            size.width,
            size.height,
          );
          container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

          if (interactive.onClick) {
            container.on("pointerdown", interactive.onClick);
          }

          if (interactive.onHover) {
            container.on("pointerover", interactive.onHover);
          }

          if (interactive.onHoverOut) {
            container.on("pointerout", interactive.onHoverOut);
          }

          if (interactive.cursor) {
            container.input.cursor = interactive.cursor;
          }
        }
      }

      // Mettre à jour la position
      const position = entity.getComponent("position");
      if (position && container) {
        container.setPosition(position.x, position.y);
      }

      // Gérer les enfants
      const children = entity.getComponent("children");
      if (children) {
          
	  // Gérer les enfants
	  const children = entity.getComponent("children");
	  if (children && children.entities) {
	      // Récupérer le conteneur parent
	      const parentContainer = entity.getGameObject("container");

	      // Pour chaque enfant
	      children.entities.forEach(childEntity => {
		  // Récupérer ou créer le conteneur de l'enfant
		  let childContainer = childEntity.getGameObject("container");

		  // Si l'enfant a un conteneur mais n'est pas un enfant du parent
		  if (childContainer && !parentContainer.list.includes(childContainer)) {
		      // Ajouter le conteneur de l'enfant au conteneur parent
		      parentContainer.add(childContainer);

		      // Ajuster la position de l'enfant pour être relative au parent
		      const childPosition = childEntity.getComponent("position");
		      if (childPosition) {
			  // Convertir les coordonnées absolues en coordonnées relatives au parent
			  childContainer.setPosition(childPosition.x, childPosition.y);
		      }
		  }
	      });
	  }
      }
    });
  }
}
