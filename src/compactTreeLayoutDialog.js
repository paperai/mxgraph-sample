const LayoutDialog = require('./layoutDialog')

class CompactTreeLayoutDialog extends LayoutDialog {
  constructor(title, graph, layout, options = {}) {
    const items = [
      {name: 'horizontal', type: 'checkbox'},
      {name: 'invert', type: 'checkbox'},
      {name: 'resizeParent', type: 'checkbox'}
    ]
    super(title, graph, layout, items, options)
  }
}

module.exports = CompactTreeLayoutDialog
