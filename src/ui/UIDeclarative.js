// src/ui/UIDeclarative.js
export class UIDeclarative {
    constructor(uiFactory) {
	this.uiFactory = uiFactory;
	this.entityIdMap = new Map(); // Pour stocker les références aux entités
    }

    // Méthode principale pour créer une interface à partir d'une définition déclarative
    createUI(definition, parentId = null) {
	// Créer l'élément racine
	const rootEntityId = this.createElement(definition, parentId);

	// Si des enfants sont définis, les créer récursivement
	if (definition.children && Array.isArray(definition.children)) {
	    for (const childDef of definition.children) {
		this.createElement(childDef, rootEntityId);
	    }
	}

	return rootEntityId;
    }

    // Créer un élément unique
    createElement(definition, parentId = null) {
	// Créer l'élément de base
	const entityId = this.uiFactory.createElement(definition);

	// Stocker l'ID avec son identifiant déclaratif si fourni
	if (definition.id) {
	    this.entityIdMap.set(definition.id, entityId);
	}

	// Si un parent est spécifié, ajouter cet élément comme enfant
	if (parentId !== null) {
	    const parentEntity = this.uiFactory.ecsManager.getEntity(parentId);
	    const childrenComp = parentEntity.getComponent("children");

	    if (childrenComp) {
		childrenComp.childIds.push(entityId);
	    } else {
		parentEntity.addComponent(new ChildrenComponent([entityId]));
	    }

	    // Notifier le changement
	    this.uiFactory.ecsManager.entityComponentChanged(parentEntity);
	}

	return entityId;
    }

    // Mettre à jour un élément par son ID déclaratif
    updateElement(id, updates) {
	const entityId = this.entityIdMap.get(id);
	if (entityId) {
	    this.uiFactory.updateEntity(entityId, updates);
	}
    }

    // Récupérer l'ID d'entité depuis l'ID déclaratif
    getEntityId(id) {
	return this.entityIdMap.get(id);
    }

    registerEventHandler(elementId, eventType, handler) {
	const entityId = this.entityIdMap.get(elementId);
	if (!entityId) return;

	const entity = this.uiFactory.ecsManager.getEntity(entityId);
	const interactive = entity.getComponent("interactive");

	if (interactive) {
	    switch(eventType) {
	    case "click":
		interactive.onClick = handler;
		break;
	    case "hover":
		interactive.onHover = handler;
		break;
	    case "hoverOut":
		interactive.onHoverOut = handler;
		break;
	    }

	    // Notifier le changement
	    this.uiFactory.ecsManager.entityComponentChanged(entity);
	}
    }

    // Méthode pour mettre à jour une propriété de texte
    setText(elementId, text) {
	this.updateElement(elementId, {
	    text: typeof text === "string" ? text : text
	});
    }

    // Méthode pour définir la visibilité
    setVisible(elementId, visible) {
	const entityId = this.entityIdMap.get(elementId);
	if (!entityId) return;

	const entity = this.uiFactory.ecsManager.getEntity(entityId);
	const container = entity.getGameObject("container");

	if (container) {
	    container.setVisible(visible);
	}
    }
    templates = new Map();

    // Enregistrer un modèle réutilisable
    registerTemplate(name, template) {
	this.templates.set(name, template);
    }

    // Créer un élément à partir d'un modèle
    createFromTemplate(templateName, overrides = {}, parentId = null) {
	const template = this.templates.get(templateName);
	if (!template) {
	    console.warn(`Template '${templateName}' not found.`);
	    return null;
	}

	// Fusionner le modèle avec les propriétés de surcharge
	const mergedDefinition = this._mergeDeep({...template}, overrides);

	// Créer l'élément
	return this.createUI(mergedDefinition, parentId);
    }

    // Utilitaire de fusion profonde
    _mergeDeep(target, source) {
	if (typeof source !== 'object' || source === null) return source;
	if (typeof target !== 'object' || target === null) return {...source};

	for (const key in source) {
	    if (source.hasOwnProperty(key)) {
		if (typeof source[key] === 'object' && source[key] !== null &&
		    typeof target[key] === 'object' && target[key] !== null) {
		    target[key] = this._mergeDeep(target[key], source[key]);
		} else {
		    target[key] = source[key];
		}
	    }
	}
	return target;
    }
    addAnimation(elementId, animationDefinition) {
	const entityId = this.entityIdMap.get(elementId);
	if (!entityId) return;

	const entity = this.uiFactory.ecsManager.getEntity(entityId);
	let animComp = entity.getComponent("animation");

	if (!animComp) {
	    animComp = new AnimationComponent();
	    entity.addComponent(animComp);
	}

	// Ajouter la définition d'animation
	animComp.animations[animationDefinition.name] = animationDefinition;

	// Notifier le changement
	this.uiFactory.ecsManager.entityComponentChanged(entity);

	return animationDefinition.name;
    }

    // Jouer une animation
    playAnimation(elementId, animationName) {
	const entityId = this.entityIdMap.get(elementId);
	if (!entityId) return;

	const entity = this.uiFactory.ecsManager.getEntity(entityId);
	const animComp = entity.getComponent("animation");

	if (animComp && animComp.animations[animationName]) {
	    animComp.currentAnimation = animationName;

	    // Notifier le changement
	    this.uiFactory.ecsManager.entityComponentChanged(entity);
	}
    }
}
