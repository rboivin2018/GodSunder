<<<<<<< Updated upstream
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'logo');

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
=======
import Phaser from 'phaser'
import { ECSManager } from '../ui/ecs/ECSManager'
import { UIRenderSystem } from '../ui/systems/UIRender'
import { UIAnimationSystem } from '../ui/systems/UIAnimation'
import { PhaserUIFactory } from '../ui/PhaserUIFactory'

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu')
    }

    create() {
        // Initialiser le gestionnaire ECS
        this.ecs = new ECSManager(this)

        // Ajouter les systèmes
        this.ecs.addSystem('render', new UIRenderSystem(this))
        this.ecs.addSystem('animation', new UIAnimationSystem(this))

        // Créer la fabrique UI
        //console.dir("ECS manager instance : " + this.ecs);
        this.ui = new PhaserUIFactory(this.ecs)

        // Créer l'interface utilisateur
        this.createUI()
    }

    createUI() {
        // Ajouter un fond
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'bg'
        )

        // Créer un panneau principal
        const mainPanel = this.ui.createPanel({
            position: {
                x: this.cameras.main.width / 2 - 150,
                y: this.cameras.main.height / 2 - 200,
            },
            size: { width: 300, height: 400 },
        })

        // Ajouter un titre
        const titleText = this.ui.createText({
            position: { x: 10, y: 10 },
            text: {
                content: 'Main Menu',
                fontSize: 24,
                color: '#333333',
                align: 'center',
            },
        })

        // Ajouter un logo
        const logo = this.ui.createImage({
            position: { x: 150, y: 100 },
            sprite: { texture: 'logo' },
        })

        // Ajouter un bouton de démarrage
        const startButton = this.ui.createButton({
            position: { x: 90, y: 200 },
            text: 'Start Game',
            onClick: () => {
                this.scene.start('Game')
            },
        })

        // Ajouter un bouton d'options
        const optionsButton = this.ui.createButton({
            position: { x: 90, y: 260 },
            text: 'Options',
            style: {
                backgroundColor: 0x27ae60,
            },
            onClick: () => {
                console.log('Options clicked')
            },
        })

        // Ajouter un texte de copyright
        const copyrightText = this.ui.createText({
            position: { x: 10, y: 350 },
            text: {
                content: '© 2025 Your Game Studio',
                fontSize: 12,
                color: '#666666',
            },
        })

        // Mettre à jour le panneau avec tous les enfants
        this.ui.updateEntity(mainPanel, {
            children: [
                titleText,
                logo,
                startButton,
                optionsButton,
                copyrightText,
            ],
        })
>>>>>>> Stashed changes
    }

    update(time, delta) {
        // Mettre à jour le système ECS
        this.ecs.update(time, delta)
    }
}
