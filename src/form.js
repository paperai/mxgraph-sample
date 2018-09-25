class Form extends mxForm {
  constructor(className) {
    super(className)
  }

  /**
   * 
   * @param {Object} buttons 
   */
  addButtons(buttons) {
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    tr.appendChild(td)
    td = document.createElement('td')
  
    for (let button of buttons) {
      let btn = document.createElement('button')
      mxUtils.write(btn, button.label)
      td.appendChild(btn)
      mxEvent.addListener(btn, 'click', button.callback)
    }

    tr.appendChild(td)
    this.body.appendChild(tr)
  }
}

module.exports = Form
