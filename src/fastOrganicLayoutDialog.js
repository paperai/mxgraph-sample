const LayoutDialog = require('./layoutDialog')

class FastOrganicLayoutDialog extends LayoutDialog {
  constructor(title, graph, layout, options = {}) {
    const items = [
      {name: 'forceConstant', type: 'text'},
      {name: 'initialTemp', type: 'text'},
      {name: 'maxIterations', type: 'text'},
      {name: 'useInputOrigin', type: 'checkbox'},
      {name: 'resetEdges', type: 'checkbox'},
      {name: 'disableEdgeStyle', type: 'checkbox'}
    ]
    super(title, graph, layout, items, options)
  }
}

module.exports = FastOrganicLayoutDialog
