const LayoutDialog = require('./layoutDialog')

class FastOrganicLayoutDialog extends LayoutDialog {
  constructor(title, graph, layout, options = {}) {
    const items = [
      {name: 'forceConstant', input: 'text', type: 'integer'},
      {name: 'initialTemp', input: 'text', type: 'integer'},
      {name: 'maxIterations', input: 'text', type: 'integer'},
      {name: 'useInputOrigin', input: 'checkbox'},
      {name: 'resetEdges', input: 'checkbox'}
      // {name: 'disableEdgeStyle', input: 'checkbox'}
    ]
    super(title, graph, layout, items, options)
  }
}

module.exports = FastOrganicLayoutDialog
