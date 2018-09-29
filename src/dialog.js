const _ = require('lodash')
const Constants = require('./constants')
const MyWindow = require('./mywindow')

class Dialog {
  /**
   * 
   * @param {String} title 
   * @param {Element} content 
   * @param {mxGraph} graph 
   * @param {Object} options 
   *   minimizable: Windowを最小化できる。Default: false
   *   movable: Windowを移動できる。Default: true
   *   className: Windowのクラス名。 Default: 'mxWindow'
   *   replaceNode: 置き換えるノード
   *   resizable: Windowがリサイズできる。Default: false
   *   maximizable: Windowを最大化できる。Default: false
   *   closable: Windowを閉じることができる。Default: true
   *   styles: divに対するスタイル
   *   modal: モーダルダイアログ。Default: true
   *   width: ダイアログの幅。Default: null
   *   height: ダイアログの高さ。Default: null
   */
  constructor(title, content, graph, options = {}) {
    this.title = title
    this.content = content
    this.graph = graph

    this.options = Object.assign({
      minimizable: false,
      movable: true,
      className: null,
      replaceNode: null,
      resizable: false,
      maximizable: false,
      closable: true,
      modal: true,
      width: null,
      height: null
    }, options)

    if (_.get(this.options, 'styles.zIndex') === undefined) {
      _.set(this.options, 'styles.zIndex', Constants.WINDOW_ALWAYS_ON_TOP)
    }
  }

  /**
   * 
   * @param {Integer} width 
   * @param {Integer} height 
   */
  center(width, height) {
    const rect = this.wnd.table.getBoundingClientRect()
    const w = width || rect.width
    const h = height || rect.height
    return {
      x: Math.max(0, document.body.scrollWidth / 2 - w / 2),
      y: Math.max(10, (document.body.scrollHeight || document.documentElement.scrollHeight) / 2 - h * 2 / 3)
    }
  }

  /**
   * 
   */
  show() {
    this.wnd = new MyWindow(this.title, this.content, -9999, -9999, this.options.width, this.options.height, this.options)

    if (this.options.modal) {
      // モーダルダイアログ
      const background = document.createElement('div')
      background.style.position = 'absolute'
      background.style.left = '0px'
      background.style.top = '0px'
      background.style.right = '0px'
      background.style.bottom = '0px'
      background.style.background = 'black'
      background.style.zIndex = Constants.WINDOW_ALWAYS_ON_TOP - 1
      mxUtils.setOpacity(background, 50)
      document.body.appendChild(background)
  
      this.wnd.addListener(mxEvent.DESTROY, event => {
        this.graph.setEnabled(true)
        mxEffects.fadeOut(background, 50, true, 10, 30, true)
      })
  
      this.graph.setEnabled(false)
    }

    this.wnd.setVisible(true)

    // ダイアログを中央に置く。
    const center = this.center()
    this.wnd.setLocation(center.x, center.y)

    return this.wnd
  }

  /**
   * 
   */
  close() {
    this.wnd.destroy()
  }
}

module.exports = Dialog
