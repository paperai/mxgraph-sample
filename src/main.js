const Editor = require('./editor')

class Main {
  constructor() {
    this.init()
  }

  init() {
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false)
      return
    }

    const config = mxUtils.load('./config/keyhandler-commons.xml').getDocumentElement()
    this.editor = new Editor(config, document.getElementById('graphContainer'))
  }
}

$(window).on('load', () => new Main())
