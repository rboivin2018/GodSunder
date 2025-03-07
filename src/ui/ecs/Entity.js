export class Entity {
    constructor(scene, id) {
        this.id = id
        this.scene = scene
        this.components = new Map()
        this.gameObjects = new Map() // Référence aux objets Phaser associés
    }

    addComponent(component) {
        this.components.set(component.type, component)
        return this
    }

    getComponent(type) {
        return this.components.get(type)
    }

    hasComponent(type) {
        return this.components.has(type)
    }

    removeComponent(type) {
        this.components.delete(type)
        return this
    }

    addGameObject(key, gameObject) {
        this.gameObjects.set(key, gameObject)
        return this
    }

    getGameObject(key) {
        return this.gameObjects.get(key)
    }

    destroy() {
        // Supprimer tous les objets Phaser associés
        this.gameObjects.forEach((obj) => {
            if (obj && obj.destroy) {
                obj.destroy()
            }
        })

        this.gameObjects.clear()
        this.components.clear()
    }
}
