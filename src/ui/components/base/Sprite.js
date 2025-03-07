import { Component } from '../../ecs/Component'

export class SpriteComponent extends Component {
    constructor(options = {}) {
        super('sprite')
        this.texture = options.texture || null
        this.frame = options.frame || null
        this.origin = options.origin || { x: 0.5, y: 0.5 }
        this.tint = options.tint || 0xffffff
        this.alpha = options.alpha !== undefined ? options.alpha : 1
        this.visible = options.visible !== undefined ? options.visible : true
    }
}
