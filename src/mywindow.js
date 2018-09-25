const ALWAYS_ON_TOP = 9000

class MyWindow extends mxWindow {
  constructor(title, content, x, y, width, height, options) {
    let {minimizable, movable, replaceNode, className} = options
    super(title, content, x, y, width, height, minimizable, movable, replaceNode, className)
    this.options = options
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
      if (index >= ALWAYS_ON_TOP) {
        return
      }
      if (mxWindow.activeWindow) {
        var elt = mxWindow.activeWindow.getElement()

        if (elt != null && elt.style != null) {
          if (elt.style.zIndex >= ALWAYS_ON_TOP) {
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
