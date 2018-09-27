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
    this.forceConstant = form.addText('forceConstant', this.initValues.forceConstant)
    this.initialTemp = form.addText('initialTemp', this.initValues.initialTemp)
    this.maxIterations = form.addText('maxIterations', this.initValues.maxIterations)
    this.useInputOrigin = form.addCheckbox('useInputOrigin', this.initValues.useInputOrigin)
    this.resetEdges = form.addCheckbox('resetEdges', this.initValues.resetEdges)
    this.disableEdgeStyle = form.addCheckbox('disableEdgeStyle', this.initValues.disableEdgeStyle)

    form.addButtons([
      {label: 'Apply', callback: applyFunc}, 
      {label: 'Close', callback: closeFunc}
    ])
    this.showDialog(title, form.getTable(), width, height)
  }
}

module.exports = FastOrganicLayoutDialog
