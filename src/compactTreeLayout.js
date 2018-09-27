const Dialog = require('./dialog')
const Form = require('./form')

class CompactTreeLayout extends Dialog {
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
    this.horizontal = form.addCheckbox('horizontal', this.initValues.horizontal)
    this.invert = form.addCheckbox('invert', this.initValues.invert)
    this.resizeParent = form.addCheckbox('resizeParent', this.initValues.resizeParent)

    // this.forceConstant = form.addText('forceConstant', this.initValues.forceConstant)

    form.addButtons([
      {label: 'Apply', callback: applyFunc}, 
      {label: 'Close', callback: closeFunc}
    ])
    this.showDialog(title, form.getTable(), width, height)
  }
}

module.exports = CompactTreeLayout
