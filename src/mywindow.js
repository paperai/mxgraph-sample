const Constants = require('./constants')

class MyWindow extends mxWindow {
  /**
   * 
   * @param {String} title 
   * @param {Element} content 
   * @param {Integer} x 
   * @param {Integer} y 
   * @param {Integer} width 
   * @param {Integer} height 
   * @param {Object} options 
   *   minimizable: Windowを最小化できる。Default: true
   *   movable: Windowを移動できる。Default: true
   *   className: Windowのクラス名。 Default: 'mxWindow'
   *   replaceNode: 置き換えるノード
   *   resizable: Windowがリサイズできる。Default: false
   *   maximizable: Windowを最大化できる。Default: false
   *   closable: Windowを閉じることができる。Default: true
   *   styles: divに対するスタイル
   */
  constructor(title, content, x, y, width, height, options = {}) {
    options = Object.assign({
      minimizable: true,
      movable: true,
      className: null,
      replaceNode: null,
      resizable: false,
      maximizable: false,
      closable: true
    }, options)

    super(title, content, x, y, width, height, options.minimizable, options.movable, options.replaceNode, options.className)

    this.options = options
    this.setResizable(options.resizable)
    this.setMaximizable(options.maximizable)
    this.setClosable(options.closable)

    // スタイルの設定
    for (let key in this.options.styles) {
      this.div.style[key] = this.options.styles[key]
    }
  }

  /**
   * Function: activate
   *
   * Puts the window on top of all other windows.
   */
  activate() {
    if (mxWindow.activeWindow != this) {
      const style = mxUtils.getCurrentStyle(this.getElement())
      const index = (style != null) ? parseInt(style.zIndex, 10) : 3
      const top = Constants.WINDOW_ALWAYS_ON_TOP

      if (mxWindow.activeWindow) {
        const elt = mxWindow.activeWindow.getElement()

        if (elt != null && elt.style != null) {
          const index2 = elt.style.zIndex

          if ((index >= top && index2 < top) || (index < top && index2 >= top)) {
            return
          }

          elt.style.zIndex = index
        }
      }

      const previousWindow = mxWindow.activeWindow
      this.getElement().style.zIndex = index + 1

      if (index < top) {
        mxWindow.activeWindow = this
        this.fireEvent(new mxEventObject(mxEvent.ACTIVATE, 'previousWindow', previousWindow))
      }
    }
  }
}

module.exports = MyWindow
