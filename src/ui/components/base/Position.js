import { Component } from '../../ecs/Component'

export class PositionComponent extends Component {
    constructor(x = 0, y = 0) {
        super('position')
        this.x = x
        this.y = y
    }
}
