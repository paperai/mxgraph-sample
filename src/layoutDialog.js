const Dialog = require('./dialog')
const Form = require('./form')

const Elements = {
  text: {func: 'addText', value: 'value'},
  checkbox: {func: 'addCheckbox', value: 'checked'}
}

class LayoutDialog extends Dialog {
  /**
   * 
   * @param {String} title 
   * @param {mxGraph} graph 
   * @param {Object} options
   *   MyWindowのオプション
   *   tableClassName: form table のクラス名。Default: layoutTable 
   *   onApply: Applyボタンのコールバック関数
   * @param {mxLayout} layout 
   * @param {Object} items 
   */
  constructor(title, graph, layout, items, options = {}) {
    super(title, null, graph, Object.assign({modal: false}, options))
    this.layout = layout
    this.items = items
    this.createFields()
  }

  /**
   * 
   */
  createFields() {
    const form = new Form(this.options.tabelClassName || 'layoutTable')

    // エレメントを作成していく
    for (let item of this.items) {
      item['element'] = form[Elements[item.input]['func']](item.name, this.layout[item.name])
    }
    form.addButtons([
      {label: 'Apply', callback: () => {
        // onApply()を呼び出す前に、値を取得してlayoutにセットする
        for (let item of this.items) {
          const value = item['element'][Elements[item.input]['value']]
          if (item.type === 'integer') {
            this.layout[item.name] = parseInt(value, 10)
          } else if (item.type === 'float') {
            this.layout[item.name] = parseFloat(value)
          } else {
            this.layout[item.name] = value
          }
        }
        this.options.onApply()
      }}, 
      {label: 'Close', callback: this.close.bind(this)}
    ])
    this.content = form.getTable()
  }
}

module.exports = LayoutDialog
