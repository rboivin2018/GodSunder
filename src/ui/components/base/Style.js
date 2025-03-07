import { Component } from '../../ecs/Component'

export class StyleComponent extends Component {
    constructor(options = {}) {
        super('style')
        this.backgroundColor = options.backgroundColor || 0x000000
        this.backgroundAlpha =
            options.backgroundAlpha !== undefined ? options.backgroundAlpha : 1
        this.borderColor = options.borderColor || 0xffffff
        this.borderWidth = options.borderWidth || 0
        this.borderRadius = options.borderRadius || 0
        this.padding = options.padding || 0
    }
}
