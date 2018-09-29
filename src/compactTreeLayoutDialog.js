const LayoutDialog = require('./layoutDialog')

class CompactTreeLayoutDialog extends LayoutDialog {
  constructor(title, graph, layout, options = {}) {
    const items = [
      {name: 'groupPadding', input: 'text', type: 'integer'},
      {name: 'groupPaddingTop', input: 'text', type: 'integer'},
      {name: 'groupPaddingRight', input: 'text', type: 'integer'},
      {name: 'groupPaddingBottom', input: 'text', type: 'integer'},
      {name: 'groupPaddingLeft', input: 'text', type: 'integer'},
      {name: 'levelDistance', input: 'text', type: 'integer'},
      {name: 'nodeDistance', input: 'text', type: 'integer'},
      {name: 'horizontal', input: 'checkbox'},
      {name: 'invert', input: 'checkbox'},
      {name: 'resizeParent', input: 'checkbox'},
      {name: 'moveTree', input: 'checkbox'},
      {name: 'visited', input: 'checkbox'},
      {name: 'resetEdges', input: 'checkbox'},
    ]
    super(title, graph, layout, items, options)
  }
}

module.exports = CompactTreeLayoutDialog
