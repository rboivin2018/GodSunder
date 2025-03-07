import { Component } from '../../ecs/Component'

export class TextComponent extends Component {
    constructor(options = {}) {
        super('text')
        this.content = options.content || ''
        this.fontFamily = options.fontFamily || 'Arial'
        this.fontSize = options.fontSize || 16
        this.color = options.color || '#ffffff'
        this.align = options.align || 'center'
        this.stroke = options.stroke || '#000000'
        this.strokeThickness = options.strokeThickness || 0
        this.wordWrap = options.wordWrap || false
        this.wordWrapWidth = options.wordWrapWidth || 0
    }
}
