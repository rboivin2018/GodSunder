export class System {
    constructor() {
        this.entities = new Set()
    }

    addEntity(entity) {
        this.entities.add(entity)
    }

    removeEntity(entity) {
        this.entities.delete(entity)
    }

    update(time, delta) {
        // À implémenter par les sous-classes
    }
}
