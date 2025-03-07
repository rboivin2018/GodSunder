import { EventEmitter } from 'events';
import { Entity } from '../ui/ecs/Entity';
import { UIComponent } from '../ui/components/base/UIComponent'
import { PositionComponent } from '../ui/components/base/Position'
import { SizeComponent } from '../ui/components/base/Size'
import { StyleComponent } from '../ui/components/base/Style'
import { TextComponent } from '../ui/components/base/Text'

export class BattleManager {
    constructor(scene) {
	this.scene = scene;
	this.events = new EventEmitter();

	// Statistiques du joueur
	this.player = {
	    hp: 100,
	    maxHp: 100,
	    attack: 15,
	    defense: 5,
	    name: 'Joueur'
	};

	// Statistiques de l'ennemi
	this.enemy = {
	    hp: 80,
	    maxHp: 80,
	    attack: 10,
	    defense: 3,
	    name: 'Ennemi'
	};

	// État du combat
	this.state = {
	    turn: 'player', // 'player' ou 'enemy'
	    turnCount: 0,
	    isGameOver: false,
	    winner: null
	};

	// Référence aux entités visuelles
	this.playerEntity = null;
	this.enemyEntity = null;
	this.statusTextEntity = null;

	// UI éléments
	this.playerHpBar = null;
	this.enemyHpBar = null;

	// Initialisation des écouteurs d'événements
	console.log("BattleManager init")
	this.initEventListeners();
    }

    // Initialiser le gestionnaire de combat avec les entités de la scène
    init() {
	console.log("call init")
	// Récupérer les entités depuis le ECS Manager
	this.playerEntity = this.scene.ecsManager.getEntity('player');
	this.enemyEntity = this.scene.ecsManager.getEntity('enemy');
	console.log("logging edit")
	// Créer les barres de vie
	//this.createHealthBars();

	// Créer la zone de texte pour les messages de statut
//	this.createStatusText();

	// Mettre à jour l'affichage
//	this.updateUI();
	console.log("loging init bis")
	// Afficher le message de début
//	this.setStatusText("Le combat commence ! C'est votre tour.");
	console.log("end init logging")
    }

    // Initialiser les écoutOAeurs d'événements pour les boutons d'attaque
    initEventListeners() {
	// Connecter aux événements émis par les boutons dans la scène
	console.log("initEventListener")
	console.dir(this.scene.events)
	this.scene.events.on('attackPlayer', this.handleAttackPlayer, this);
	this.scene.events.on('attackEnemy', this.handleAttackEnemy, this);
    }
    // Créer les barres de vie pour le joueur et l'ennemi
/*    createHealthBars() {
	const width = this.scene.cameras.main.width;
	const height = this.scene.cameras.main.height;
	const scaleRatio = this.scene.scaleRatio;

	// Barre de vie du joueur
	const playerHpBarWidth = 100 * scaleRatio;
	const playerHpBarHeight = 10 * scaleRatio;
	const playerHpBarX = width * 0.25;
	const playerHpBarY = height * 0.45;

	// Conteneur pour la barre de vie du joueur
	const playerHpContainer = new Entity('playerHpContainer');
	playerHpContainer.addComponent(new UIComponent());
	playerHpContainer.addComponent(new PositionComponent(playerHpBarX, playerHpBarY));
	playerHpContainer.addComponent(new SizeComponent(playerHpBarWidth, playerHpBarHeight));
	playerHpContainer.addComponent(new StyleComponent({
	    backgroundColor: 0x333333,
	    backgroundAlpha: 1,
	    borderColor: 0xffffff,
	    borderWidth: 1
	}));
		console.log("logging bis")
	this.scene.ecsManager.addEntity(playerHpContainer);
	console.log("logging ter")
	// Barre de vie remplissage du joueur
	this.playerHpBar = new Entity('playerHpBar');
	this.playerHpBar.addComponent(new UIComponent());
	this.playerHpBar.addComponent(new PositionComponent(playerHpBarX - (playerHpBarWidth / 2) + (playerHpBarWidth * this.player.hp / this.player.maxHp / 2), playerHpBarY));
	this.playerHpBar.addComponent(new SizeComponent(playerHpBarWidth * this.player.hp / this.player.maxHp, playerHpBarHeight));
	this.playerHpBar.addComponent(new StyleComponent({
	    backgroundColor: 0x00ff00,
	    backgroundAlpha: 1
	}));
	this.scene.ecsManager.addEntity(this.playerHpBar);

	// Texte HP du joueur
	const playerHpText = new Entity('playerHpText');
	playerHpText.addComponent(new UIComponent());
	playerHpText.addComponent(new PositionComponent(playerHpBarX, playerHpBarY - playerHpBarHeight - 5));
	playerHpText.addComponent(new TextComponent({
	    content: `HP: ${this.player.hp}/${this.player.maxHp}`,
	    fontSize: 12,
	    color: '#ffffff',
	    align: 'center'
	}));
	this.scene.ecsManager.addEntity(playerHpText);
	console.log("logging end")
	// Barre de vie de l'ennemi
	const enemyHpBarWidth = 100 * scaleRatio;
	const enemyHpBarHeight = 10 * scaleRatio;
	const enemyHpBarX = width * 0.75;
	const enemyHpBarY = height * 0.45;

	// Conteneur pour la barre de vie de l'ennemi
	const enemyHpContainer = new Entity('enemyHpContainer');
	enemyHpContainer.addComponent(new UIComponent());
	enemyHpContainer.addComponent(new PositionComponent(enemyHpBarX, enemyHpBarY));
	enemyHpContainer.addComponent(new SizeComponent(enemyHpBarWidth, enemyHpBarHeight));
	enemyHpContainer.addComponent(new StyleComponent({
	    backgroundColor: 0x333333,
	    backgroundAlpha: 1,
	    borderColor: 0xffffff,
	    borderWidth: 1
	}));
	this.scene.ecsManager.addEntity(enemyHpContainer);

	// Barre de vie remplissage de l'ennemi
	this.enemyHpBar = new Entity('enemyHpBar');
	this.enemyHpBar.addComponent(new UIComponent());
	this.enemyHpBar.addComponent(new PositionComponent(enemyHpBarX - (enemyHpBarWidth / 2) + (enemyHpBarWidth * this.enemy.hp / this.enemy.maxHp / 2), enemyHpBarY));
	this.enemyHpBar.addComponent(new SizeComponent(enemyHpBarWidth * this.enemy.hp / this.enemy.maxHp, enemyHpBarHeight));
	this.enemyHpBar.addComponent(new StyleComponent({
	    backgroundColor: 0xff0000,
	    backgroundAlpha: 1
	}));
	this.scene.ecsManager.addEntity(this.enemyHpBar);

	// Texte HP de l'ennemi
	const enemyHpText = new Entity('enemyHpText');
	enemyHpText.addComponent(new UIComponent());
	enemyHpText.addComponent(new PositionComponent(enemyHpBarX, enemyHpBarY - enemyHpBarHeight - enemyHpBarHeight - 5));
						       enemyHpText.addComponent(new TextComponent({
	    content: `HP: ${this.enemy.hp}/${this.enemy.maxHp}`,
	    fontSize: 12,
	    color: '#ffffff',
	    align: 'center'
	}));
						       this.scene.ecsManager.addEntity(enemyHpText);
						      }

*/
    // Créer le texte de statut
				 createStatusText() {
				     const width = this.scene.cameras.main.width;
				     const height = this.scene.cameras.main.height;

				     this.statusTextEntity = new Entity('statusText');
				     this.statusTextEntity.addComponent(new UIComponent());
				     this.statusTextEntity.addComponent(new PositionComponent(width / 2, height * 0.3));
				     this.statusTextEntity.addComponent(new StyleComponent({
					 backgroundColor: 0x000000,
					 backgroundAlpha: 0.7,
					 borderColor: 0xffffff,
					 borderWidth: 1,
					 borderRadius: 10,
					 padding: 10
				     }));
				     this.statusTextEntity.addComponent(new SizeComponent(width * 0.6, 60));
				     this.statusTextEntity.addComponent(new TextComponent({
					 content: "",
					 fontSize: 16,
					 color: '#ffffff',
					 align: 'center',
					 wordWrap: true
				     }));
				     this.scene.ecsManager.addEntity(this.statusTextEntity);
				 }

				 // Gérer l'attaque sur le joueur
    handleAttackPlayer() {
	console.log("Enemy attacked")
	console.log("player help: " + this.player.hp)
				     if (this.state.isGameOver || this.state.turn !== 'player') {
					 return;
				     }

				     // Attaque de l'ennemi sur le joueur
				     const damage = Math.max(1, this.enemy.attack - this.player.defense);
				     this.player.hp = Math.max(0, this.player.hp - damage);

				     // Afficher le message d'attaque
				     this.setStatusText(`${this.enemy.name} attaque ! ${this.player.name} perd ${damage} points de vie.`);

				     // Vérifier si le joueur est vaincu
				     if (this.player.hp <= 0) {
					 this.state.isGameOver = true;
					 this.state.winner = 'enemy';
					 this.setStatusText(`${this.player.name} est vaincu ! ${this.enemy.name} remporte le combat.`);
					 this.disableButtons();
				     } else {
					 // Passer au tour suivant
					 this.state.turn = 'enemy';
					 this.state.turnCount++;

					 // Simuler un délai avant le tour de l'ennemi
					 setTimeout(() => {
					     this.enemyTurn();
					 }, 1500);
				     }

				     // Mettre à jour l'affichage
				     this.updateUI();
				 }
    // Gérer l'attaque sur l'ennemi
    handleAttackEnemy() {
	if (this.state.isGameOver || this.state.turn !== 'player') {
	    return;
	}

	// Attaque du joueur sur l'ennemi
	const damage = Math.max(1, this.player.attack - this.enemy.defense);
	this.enemy.hp = Math.max(0, this.enemy.hp - damage);

	// Afficher le message d'attaque
	this.setStatusText(`${this.player.name} attaque ! ${this.enemy.name} perd ${damage} points de vie.`);

	// Vérifier si l'ennemi est vaincu
	if (this.enemy.hp <= 0) {
	    this.state.isGameOver = true;
	    this.state.winner = 'player';
	    this.setStatusText(`${this.enemy.name} est vaincu ! ${this.player.name} remporte le combat.`);
	    this.disableButtons();
	} else {
	    // Passer au tour suivant
	    this.state.turn = 'enemy';
	    this.state.turnCount++;

	    // Simuler un délai avant le tour de l'ennemi
	    setTimeout(() => {
		this.enemyTurn();
	    }, 1500);
	}

	// Mettre à jour l'affichage
	this.updateUI();
    }

    // Tour de l'ennemi (IA simple)
    enemyTurn() {
	if (this.state.isGameOver) {
	    return;
	}

	// L'ennemi attaque toujours le joueur
	const damage = Math.max(1, this.enemy.attack - this.player.defense);
	this.player.hp = Math.max(0, this.player.hp - damage);

	// Afficher le message d'attaque
	this.setStatusText(`${this.enemy.name} attaque ! ${this.player.name} perd ${damage} points de vie.`);

	// Vérifier si le joueur est vaincu
	if (this.player.hp <= 0) {
	    this.state.isGameOver = true;
	    this.state.winner = 'enemy';
	    this.setStatusText(`${this.player.name} est vaincu ! ${this.enemy.name} remporte le combat.`);
	    this.disableButtons();
	} else {
	    // Passer au tour du joueur
	    this.state.turn = 'player';
	    this.state.turnCount++;
	    this.setStatusText("C'est votre tour ! Choisissez une action.");
	}

	// Mettre à jour l'affichage
	this.updateUI();
    }    // Mettre à jour l'interface utilisateur
    updateUI() {
	// Mettre à jour les barres de vie
	const playerHpEntity = this.scene.ecsManager.getEntity('playerHpBar');
	const playerHpTextEntity = this.scene.ecsManager.getEntity('playerHpText');
	const enemyHpEntity = this.scene.ecsManager.getEntity('enemyHpBar');
	const enemyHpTextEntity = this.scene.ecsManager.getEntity('enemyHpText');

	if (playerHpEntity) {
	    const width = this.scene.cameras.main.width;
	    const scaleRatio = this.scene.scaleRatio;
	    const barWidth = 100 * scaleRatio;

	    // Calculer la nouvelle largeur de la barre de vie du joueur
	    const newPlayerHpWidth = barWidth * (this.player.hp / this.player.maxHp);
	    const sizeComp = playerHpEntity.getComponent('size');
	    sizeComp.width = newPlayerHpWidth;

	    // Ajuster la position pour que la barre reste ancrée à gauche
	    const posComp = playerHpEntity.getComponent('position');
	    posComp.x = width * 0.25 - (barWidth / 2) + (newPlayerHpWidth / 2);

	    // Mettre à jour le texte HP du joueur
	    const textComp = playerHpTextEntity.getComponent('text');
	    textComp.content = `HP: ${this.player.hp}/${this.player.maxHp}`;
	}

	if (enemyHpEntity) {
	    const width = this.scene.cameras.main.width;
	    const scaleRatio = this.scene.scaleRatio;
	    const barWidth = 100 * scaleRatio;

	    // Calculer la nouvelle largeur de la barre de vie de l'ennemi
	    const newEnemyHpWidth = barWidth * (this.enemy.hp / this.enemy.maxHp);
	    const sizeComp = enemyHpEntity.getComponent('size');
	    sizeComp.width = newEnemyHpWidth;

	    // Ajuster la position pour que la barre reste ancrée à gauche
	    const posComp = enemyHpEntity.getComponent('position');
	    posComp.x = width * 0.75 - (barWidth / 2) + (newEnemyHpWidth / 2);

	    // Mettre à jour le texte HP de l'ennemi
	    const textComp = enemyHpTextEntity.getComponent('text');
	    textComp.content = `HP: ${this.enemy.hp}/${this.enemy.maxHp}`;
	}

	// Mettre à jour l'apparence des entités en fonction de leur état
	this.updateEntityAppearance();
    }

    // Add this method after updateEntityAppearance() and before the export const updateBattleScene
    disableButtons() {
	const attackPlayerButton = this.scene.ecsManager.getEntity('attackPlayerButton');
	const attackEnemyButton = this.scene.ecsManager.getEntity('attackEnemyButton');

	if (attackPlayerButton) {
	    const styleComp = attackPlayerButton.getComponent('style');
	    styleComp.backgroundColor = 0x777777; // Gris pour indiquer désactivé

	    // Désactiver les interactions
	    const interactiveComp = attackPlayerButton.getComponent('interactive');
	    attackPlayerButton.removeComponent('interactive');
	}

	if (attackEnemyButton) {
	    const styleComp = attackEnemyButton.getComponent('style');
	    styleComp.backgroundColor = 0x777777; // Gris pour indiquer désactivé

	    // Désactiver les interactions
	    const interactiveComp = attackEnemyButton.getComponent('interactive');
	    attackEnemyButton.removeComponent('interactive');
	}
    }
}


export const updateBattleScene = (Battle) => {
    // Étendre la classe Battle
    const originalCreate = Battle.prototype.create;

    Battle.prototype.create = function() {
	// Appeler la méthode create originale
	originalCreate.call(this);

	// Initialiser le gestionnaire de combat
	this.battleManager = new BattleManager(this);
	this.battleManager.init();
    };

    return Battle;
};
