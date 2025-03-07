import { Entity } from './Entity'

export class ECSManager {
    constructor(scene) {
        this.scene = scene
        this.entities = new Map()
        this.systems = new Map()
        this.nextEntityId = 0
    }

    createEntity() {
        const id = this.nextEntityId++
        const entity = new Entity(this.scene, id)
        this.entities.set(id, entity)
        return entity
    }

    removeEntity(entityId) {
        const entity = this.entities.get(entityId)
        if (entity) {
            // Retirer l'entité de tous les systèmes
            this.systems.forEach((system) => system.removeEntity(entity))

            // Détruire l'entité
            entity.destroy()

            // Supprimer l'entité du manager
            this.entities.delete(entityId)
        }
    }

    getEntity(entityId) {
        return this.entities.get(entityId)
    }

    addSystem(type, system) {
        this.systems.set(type, system)

        // Ajouter les entités existantes qui correspondent aux critères du système
        this.entities.forEach((entity) => {
            this._checkEntityForSystem(entity, system)
        })
    }

    removeSystem(type) {
        this.systems.delete(type)
    }

    update(time, delta) {
        this.systems.forEach((system) => system.update(time, delta))
    }

    // Vérifie si une entité doit être gérée par un système
    _checkEntityForSystem(entity, system) {
        if (system.requiresComponents) {
            const hasAllComponents = system.requiresComponents.every(
                (componentType) => entity.hasComponent(componentType)
            )

            if (hasAllComponents) {
                system.addEntity(entity)
            } else {
                system.removeEntity(entity)
            }
        }
    }

    // Appelé quand une entité est modifiée
    entityComponentChanged(entity) {
        this.systems.forEach((system) => {
            this._checkEntityForSystem(entity, system)
        })
    }
}
