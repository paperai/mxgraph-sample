const LayoutDialog = require('./layoutDialog')

class RadialTreeLayoutDialog extends LayoutDialog {
  constructor(title, graph, layout, options = {}) {
    const items = [
      {name: 'levelDistance', input: 'text', type: 'integer'},
      {name: 'nodeDistance', input: 'text', type: 'integer'},
      {name: 'sortEdges', input: 'checkbox'},
    ]
    super(title, graph, layout, items, options)
  }
}

module.exports = RadialTreeLayoutDialog
