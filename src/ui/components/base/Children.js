import { Component } from '../../ecs/Component'

export class ChildrenComponent extends Component {
    constructor(children = []) {
        super('children')
        this.childIds = children
    }
}
