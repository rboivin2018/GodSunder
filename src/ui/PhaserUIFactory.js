// src/ui/PhaserUIFactory.js
import { UIComponent } from "./components/base/UIComponent";
import { PositionComponent } from "./components/base/Position";
import { SizeComponent } from "./components/base/Size";
import { StyleComponent } from "./components/base/Style";
import { TextComponent } from "./components/base/Text";
import { InteractiveComponent } from "./components/base/Interactive";
import { ChildrenComponent } from "./components/base/Children";
import { SpriteComponent } from "./components/base/Sprite";
import { AnimationComponent } from "./components/base/Animation";

export class PhaserUIFactory {
  constructor(ecsManager) {
    this.ecsManager = ecsManager;
  }

  // Méthode principale pour créer n'importe quel élément UI
  createElement(props = {}) {
    const entity = this.ecsManager.createEntity();

    // Ajouter le composant UI de base
    entity.addComponent(new UIComponent());

    // Ajouter la position
    if (props.position) {
      entity.addComponent(
        new PositionComponent(props.position.x, props.position.y),
      );
    } else {
      entity.addComponent(new PositionComponent(0, 0));
    }

    // Ajouter la taille
    if (props.size) {
      entity.addComponent(
        new SizeComponent(props.size.width, props.size.height),
      );
    } else {
      entity.addComponent(new SizeComponent());
    }

    // Ajouter le style
    if (props.style) {
      entity.addComponent(new StyleComponent(props.style));
    }

    // Ajouter le texte
    if (props.text) {
      const textOptions =
        typeof props.text === "string" ? { content: props.text } : props.text;

      entity.addComponent(new TextComponent(textOptions));
    }

    // Ajouter l'interactivité
    if (props.interactive) {
      entity.addComponent(new InteractiveComponent(props.interactive));
    }

    // Ajouter le sprite
    if (props.sprite) {
      entity.addComponent(new SpriteComponent(props.sprite));
    }

    // Ajouter l'animation
    if (props.animation) {
      entity.addComponent(new AnimationComponent(props.animation));
    }

    // Ajouter les enfants
    if (props.children) {
      entity.addComponent(new ChildrenComponent(props.children));
    }

    // Notifier le gestionnaire qu'une entité a été modifiée
    this.ecsManager.entityComponentChanged(entity);

    return entity.id;
  }

  // Méthodes utilitaires pour les éléments courants
  createButton(options = {}) {
    const defaults = {
      position: { x: 0, y: 0 },
      size: { width: 120, height: 40 },
      style: {
        backgroundColor: 0x3498db,
        backgroundAlpha: 1,
        borderRadius: 5,
        padding: 5,
      },
      text: {
        content: options.text || "Button",
        color: "#ffffff",
        fontSize: 16,
        align: "center",
      },
      interactive: {
        onClick: options.onClick || (() => {}),
        cursor: "pointer",
      },
    };

    // Fusionner les options avec les valeurs par défaut
    const mergedOptions = this._mergeOptions(defaults, options);

    return this.createElement(mergedOptions);
  }

  createPanel(options = {}) {
    const defaults = {
      position: { x: 0, y: 0 },
      size: { width: 300, height: 200 },
      style: {
        backgroundColor: 0xf8f9fa,
        backgroundAlpha: 0.8,
        borderColor: 0xdedede,
        borderWidth: 2,
        borderRadius: 8,
        padding: 10,
      },
      children: options.children || [],
    };

    // Fusionner les options avec les valeurs par défaut
    const mergedOptions = this._mergeOptions(defaults, options);

    return this.createElement(mergedOptions);
  }

  createText(options = {}) {
    const defaults = {
      position: { x: 0, y: 0 },
      text: {
        content: options.text || "",
        color: "#333333",
        fontSize: 16,
        align: "left",
      },
    };

    // Fusionner les options avec les valeurs par défaut
    const mergedOptions = this._mergeOptions(defaults, options);

    return this.createElement(mergedOptions);
  }

  createPanel(options = {}) {
    const defaults = {
      position: { x: 0, y: 0 },
      size: { width: 300, height: 200 },
      style: {
        backgroundColor: 0xf8f9fa,
        backgroundAlpha: 0.8,
        borderColor: 0xdedede,
        borderWidth: 2,
        borderRadius: 8,
        padding: 10,
      },
      children: options.children || [],
    };

    // Fusionner les options avec les valeurs par défaut
    const mergedOptions = this._mergeOptions(defaults, options);

    return this.createElement(mergedOptions);
  }

  createText(options = {}) {
    const defaults = {
      position: { x: 0, y: 0 },
      text: {
        content: options.text || "",
        color: "#333333",
        fontSize: 16,
        align: "left",
      },
    };

    // Fusionner les options avec les valeurs par défaut
    const mergedOptions = this._mergeOptions(defaults, options);

    return this.createElement(mergedOptions);
  }

  createImage(options = {}) {
    const defaults = {
      position: { x: 0, y: 0 },
      sprite: {
        texture: options.texture || "",
        frame: options.frame || null,
      },
    };

    // Fusionner les options avec les valeurs par défaut
    const mergedOptions = this._mergeOptions(defaults, options);

    return this.createElement(mergedOptions);
  }

  // Mise à jour d'une entité
  updateEntity(entityId, updates = {}) {
    const entity = this.ecsManager.getEntity(entityId);

    if (!entity) {
      console.warn(`Entity with ID ${entityId} not found.`);
      return;
    }

    // Mettre à jour la position
    if (updates.position) {
      const position = entity.getComponent("position");
      if (position) {
        position.x =
          updates.position.x !== undefined ? updates.position.x : position.x;
        position.y =
          updates.position.y !== undefined ? updates.position.y : position.y;
      }
    }

    // Mettre à jour la taille
    if (updates.size) {
      const size = entity.getComponent("size");
      if (size) {
        size.width =
          updates.size.width !== undefined ? updates.size.width : size.width;
        size.height =
          updates.size.height !== undefined ? updates.size.height : size.height;

        // Recréer l'arrière-plan
        const background = entity.getGameObject("background");
        if (background) {
          background.destroy();
          entity.getGameObject("container").remove(background);

          // La prochaine mise à jour du système va recréer l'arrière-plan
        }
      }
    }

    // Mettre à jour le texte
    if (updates.text) {
      const textComp = entity.getComponent("text");
      if (textComp) {
        if (typeof updates.text === "string") {
          textComp.content = updates.text;
        } else {
          Object.assign(textComp, updates.text);
        }

        const textObj = entity.getGameObject("text");
        if (textObj) {
          textObj.setText(textComp.content);
          textObj.setStyle({
            fontFamily: textComp.fontFamily,
            fontSize: `${textComp.fontSize}px`,
            color: textComp.color,
            align: textComp.align,
            stroke: textComp.stroke,
            strokeThickness: textComp.strokeThickness,
          });
        }
      }
    }

    // Mettre à jour le style
    if (updates.style) {
      const style = entity.getComponent("style");
      if (style) {
        Object.assign(style, updates.style);

        // Recréer l'arrière-plan
        const background = entity.getGameObject("background");
        if (background) {
          background.destroy();
          entity.getGameObject("container").remove(background);

          // La prochaine mise à jour du système va recréer l'arrière-plan
        }
      }
    }

    // Notifier le gestionnaire qu'une entité a été modifiée
    this.ecsManager.entityComponentChanged(entity);
  }

  // Utilitaire pour fusionner profondément les options
  _mergeOptions(defaults, options) {
    const result = { ...defaults };

    for (const [key, value] of Object.entries(options)) {
      if (value === undefined) continue;

      if (
        typeof value === "object" &&
        value !== null &&
        typeof defaults[key] === "object"
      ) {
        result[key] = this._mergeOptions(defaults[key], value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
