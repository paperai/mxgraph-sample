const Dialog = require('./dialog')
const Form = require('./form')

class FastOrganicLayoutDialog extends Dialog {
  constructor(initValues) {
    super()
    this.initValues = initValues
  }

  /**
   * 
   * @param {String} title 
   * @param {Integer} width 
   * @param {Integer} height 
   */
  show(title, width, height, applyFunc, closeFunc) {
    const form = new Form('parameter')
    this.forceConstant = form.addText('forceConstant', this.initValues.forceConstant || '50')
    this.useInputOrigin = form.addCheckbox('useInputOrigin', this.initValues.useInputOrigin || true)
    this.resetEdges = form.addCheckbox('resetEdges', this.initValues.resetEdges || true)
    this.disableEdgeStyle = form.addCheckbox('disableEdgeStyle', this.initValues.disableEdgeStyle || true)
    form.addButtons([
      {label: 'Apply', callback: applyFunc}, 
      {label: 'Close', callback: closeFunc}
    ])
    this.showDialog(title, form.getTable(), width, height)
  }
}

module.exports = FastOrganicLayoutDialog
