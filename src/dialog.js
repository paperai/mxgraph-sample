const MyWindow = require('./mywindow')

class Dialog {
  constructor() {
  }

  /**
   * 
   * @param {String} title 
   * @param {Element} content 
   * @param {Integer} width 
   * @param {Integer} height 
   */
  showDialog(title, content, width, height) {
    const x = Math.max(0, document.body.scrollWidth / 2 - width / 2)
    const y = Math.max(10, (document.body.scrollHeight || document.documentElement.scrollHeight) / 2 - height * 2 / 3)
    this.wnd = new MyWindow(title, content, x, y, width, height, {
      minimizable: false, movable:true, styles: {zIndex: 9000}})
    this.wnd.setClosable(true)
    this.wnd.setVisible(true)
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
