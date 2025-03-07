import { BaseScene } from "../scenes/Base";
import { BattleManager } from "../game/Battle";

export class Battle extends BaseScene {
    constructor() {
	super("Battle");
    }

    create() {
	// Appeler la méthode create du parent pour initialiser les systèmes ECS
	super.create();
	console.log("Battle create method called");

	// Récupérer les dimensions de la caméra
	const width = this.cameras.main.width;
	const height = this.cameras.main.height;

	// Créer l'interface de bataille
	this.createBattleUI(width, height);
	this.battleManager = new BattleManager(this)
	this.battleManager.init();
    }
    createBattleUI(width, height) {
	// Créer un fond pour la scène de bataille
	this.uiFactory.createElement({
	    position: { x: width / 4, y: height / 2 },
	    size: { width: width, height: height },
	    style: {
		backgroundColor: 0x555555,
		backgroundAlpha: 1
	    }
	});

	// Créer le joueur
	const playerWidth = 120 * this.scaleRatio;
	const playerHeight = 150 * this.scaleRatio;
	const playerX = width * 0.25;
	const playerY = height * 0.6;

	this.uiFactory.createElement({
	    position: { x: playerX, y: playerY },
	    size: { width: playerWidth, height: playerHeight },
	    style: {
		backgroundColor: 0x00ff00,
		backgroundAlpha: 1,
		borderColor: 0xffffff,
		borderWidth: 3,
		borderRadius: 10
	    },
	    text: {
		content: "Joueur",
		fontSize: 16,
		color: "#000000",
		align: "center",
		fontFamily: "Arial"
	    }
	});

	// Créer l'ennemi
	const enemyWidth = 120 * this.scaleRatio;
	const enemyHeight = 150 * this.scaleRatio;
	const enemyX = width * 0.75;
	const enemyY = height * 0.6;

	this.uiFactory.createElement({
	    position: { x: enemyX, y: enemyY },
	    size: { width: enemyWidth, height: enemyHeight },
	    style: {
		backgroundColor: 0xff0000,
		backgroundAlpha: 1,
		borderColor: 0xffffff,
		borderWidth: 3,
		borderRadius: 10
	    },
	    text: {
		content: "Ennemi",
		fontSize: 16,
		color: "#000000",
		align: "center",
		fontFamily: "Arial"
	    }
	});

	// Créer le bouton d'attaque du joueur en utilisant createButton
	this.uiFactory.createButton({
	    position: { x: width * 0.25, y: height * 0.8 },
	    size: { width: 150 * this.scaleRatio, height: 50 * this.scaleRatio },
	    text: "Attaquer Joueur",
	    style: {
		backgroundColor: 0x4444ff,
		backgroundAlpha: 1,
		borderColor: 0xffffff,
		borderWidth: 2,
		borderRadius: 10,
		padding: 10
	    },
	    interactive: {
		onClick: () => {
		    console.log("ckick")
		    this.events.emit('attackPlayer');
		},
		onHover: () => {
		    // Nous ne pouvons pas accéder directement au style comme avant,
		    // mais nous verrons comment gérer cela avec updateEntity
		},
		onHoverOut: () => {
		    // Même chose ici
		},
		cursor: 'pointer'
	    }
	});

	// Créer le bouton d'attaque de l'ennemi
	const attackEnemyButtonId = this.uiFactory.createButton({
	    position: { x: width * 0.75, y: height * 0.8 },
	    size: { width: 150 * this.scaleRatio, height: 50 * this.scaleRatio },
	    text: "Attaquer Ennemi",
	    style: {
		backgroundColor: 0x4444ff,
		backgroundAlpha: 1,
		borderColor: 0xffffff,
		borderWidth: 2,
		borderRadius: 10,
		padding: 10
	    },
	    interactive: {
		onClick: () => {
		    this.events.emit('attackEnemy');
		},
		cursor: 'pointer'
	    }
	});

	// Exemple d'utilisation de updateEntity pour gérer le hover
	const attackEnemyEntity = this.ecsManager.getEntity(attackEnemyButtonId);
	if (attackEnemyEntity) {
	    const interactiveComponent = attackEnemyEntity.getComponent('interactive');
	    if (interactiveComponent) {
		interactiveComponent.onHover = () => {
		    this.uiFactory.updateEntity(attackEnemyButtonId, {
			style: { backgroundColor: 0x6666ff }
		    });
		};

		interactiveComponent.onHoverOut = () => {
		    this.uiFactory.updateEntity(attackEnemyButtonId, {
			style: { backgroundColor: 0x4444ff }
		    });
		};
	    }
	}
    }
}
