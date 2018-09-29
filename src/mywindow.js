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
      var style = mxUtils.getCurrentStyle(this.getElement())
      var index = (style != null) ? style.zIndex : 3
      if (index >= Constants.WINDOW_ALWAYS_ON_TOP) {
        return
      }

      if (mxWindow.activeWindow) {
        var elt = mxWindow.activeWindow.getElement()

        if (elt != null && elt.style != null) {
          if (elt.style.zIndex >= Constants.WINDOW_ALWAYS_ON_TOP) {
            return
          }
          elt.style.zIndex = index
        }
      }

      var previousWindow = mxWindow.activeWindow
      this.getElement().style.zIndex = parseInt(index) + 1
      mxWindow.activeWindow = this
      this.fireEvent(new mxEventObject(mxEvent.ACTIVATE, 'previousWindow', previousWindow))
    }
  }
}

module.exports = MyWindow
