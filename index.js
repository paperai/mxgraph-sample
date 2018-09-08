var xmlbuilder = require('xmlbuilder')

// windowの左上コーナーの位置と幅、高さ
const WINDOW_X = 50
const WINDOW_Y = 50
const WINDOW_WIDTH = 1200
const WINDOW_HEIGHT = 600

// ノードの幅と高さ
const VERTEX_WIDTH = 80
const VERTEX_HEIGHT = 30

// 定義しているカラースタイル数
const COLOR_STYLE_MAX = 4

// カラースタイル
// 定義しているカラースタイルをランダムにスパンに割り当てる。
const colorStyles = {
  color1: {
    [mxConstants.STYLE_STROKECOLOR]: 'black',
    [mxConstants.STYLE_FONTCOLOR]: 'black',
    [mxConstants.STYLE_FILLCOLOR]: '#e5c095'
  },
  color2: {
    [mxConstants.STYLE_STROKECOLOR]: 'black',
    [mxConstants.STYLE_FONTCOLOR]: 'black',
    [mxConstants.STYLE_FILLCOLOR]: '#d37a9b'
  },
  color3: {
    [mxConstants.STYLE_STROKECOLOR]: 'black',
    [mxConstants.STYLE_FONTCOLOR]: 'black',
    [mxConstants.STYLE_FILLCOLOR]: '#b3efbb'
  },
  color4: {
    [mxConstants.STYLE_STROKECOLOR]: 'black',
    [mxConstants.STYLE_FONTCOLOR]: 'black',
    [mxConstants.STYLE_FILLCOLOR]: '#8edee2'
  }
}

// shapeの一覧
const shapeList = [
  'actor',
  'cloud',
  'cylinder',
  'doubleEllipse',
  'ellipse',
  'hexagon',
  'rectangle',
  'rhombus',
  'swimlane',
  'triangle'
]

/**
 * 0 <= random < max の範囲の整数の乱数を生成。
 * @param {Integer} max 
 */
function randomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

/**
 * カラーを登録する
 * @param {mxGraph} graph 
 */
function registerColors (graph) {
  Object.keys(colorStyles).forEach(key => {
    graph.getStylesheet().putCellStyle(key, colorStyles[key])
  })
}

/**
 * シェイプを登録する
 * @param {mxGraph} graph 
 */
function registerShapes (graph) {
  shapeList.forEach(key => {
    const style = new Object()
    style[mxConstants.STYLE_SHAPE] = key
    graph.getStylesheet().putCellStyle(key, style)
  })
}

// Program starts here. Creates a sample graph in the
// DOM node with the specified ID. This function is invoked
// from the onLoad event handler of the document (see below).
function main (container) {
 	// Sets the image to be used for creating new connections
	mxConnectionHandler.prototype.connectImage = new mxImage('images/handle-main.png', 17, 17)

  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false)
    return
  }

  // Note that we're using the container scrollbars for the graph so that the
  // container extends to the parent div inside the window
  var wnd = new mxWindow('mxGraph sample program', container, WINDOW_X, WINDOW_Y, WINDOW_WIDTH, WINDOW_HEIGHT, true, true)

  wnd.setMaximizable(true)
  wnd.setResizable(true)
  wnd.setVisible(true)

  // Creates the graph inside the given container
  var graph = new mxGraph(container)

  graph.setTooltips(true)
  graph.setPanning(true)
  graph.setConnectable(true)
  graph.setAutoSizeCells(true)

  // graph.autoSizeCellsOnAdd = true

  // セルのラベルの編集を禁止する
  graph.setCellsEditable(false)

  // セルのラベルを描画する
  // セルのattributeを設定しているため
  graph.convertValueToString = cell => {
    if (mxUtils.isNode(cell.value)) {
      if (cell.isVertex()) {
        return cell.getAttribute('label', '') + '\n' + cell.getAttribute('text', '')
      } else {
        console.log(cell.getValue())
        return cell.getValue()
      }
    } else {
      return cell.getValue()
    }
  }
  
  var layout = new mxParallelEdgeLayout(graph)
  var layoutMgr = new mxLayoutManager(graph)

  layoutMgr.getLayout = cell => {
    if (cell.getChildCount() > 0) {
      return layout
    }
  }

  var rubberband = new mxRubberband(graph)
  new mxKeyHandler(graph)

  const style = graph.getStylesheet().getDefaultEdgeStyle()
  style[mxConstants.STYLE_ROUNDED] = true

  // カラースタイルを登録する
  registerColors(graph)

  // シェイプを登録する
  registerShapes(graph)

  // エッジ・スタイルは要検討
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SideToSide
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.Loop
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SegmentConnector
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector

  graph.alternateEdgeStyle = 'elbow=vertical'

  mxEvent.disableContextMenu(container)

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent()

  // mxLog.show()

  // シェイプを select に表示
  const shape = $('select#shape')
  shapeList.forEach(key => {
    $('<option>').attr('value', key).text(key).appendTo(shape)
  })

  let count = 10

  // スパン追加のハンドラー
  $('#add-span').click(() => {
    graph.getModel().beginUpdate()

    try {
      const color = Object.keys(colorStyles)[randomInt(COLOR_STYLE_MAX)]
      let shape = $('select#shape').val()

      if (shape === '0') {
        // シェイプを選択していない場合は、rectangle にする。
        shape = 'rectangle'
      }

      const doc = mxUtils.createXmlDocument()
      const node = doc.createElement('pdfanno')
      node.setAttribute('label', $('input#span-label').val())
      node.setAttribute('text', $('input#span-text').val())
      node.setAttribute('pdfannoId', randomInt(100))
      node.setAttribute('textrange', [randomInt(100), randomInt(100)])
      // graph.insertVertex(parent, null, node, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color + ';' + shape)
      graph.insertVertex(parent, count++, node, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color + ';' + shape)
    } finally {
      graph.getModel().endUpdate()
    }
  })

  graph.addListener(mxEvent.CELL_CONNECTED, (g, event) => {
    console.log('CELL_CONNECTED')
    const source = event.getProperty('source') ? 'source' : 'target'
    console.log(`  edge id=${event.getProperty('edge').id} geometry=${JSON.stringify(event.getProperty('edge').getGeometry())}`)
    console.log(`  vertex id=${event.getProperty('terminal').id} ${source}, geometry=${JSON.stringify(event.getProperty('terminal').getGeometry())}`)
  })

  graph.addListener(mxEvent.CELLS_ADDED, (g, event) => {
    console.log('CELLS_ADDED')
    event.getProperty('cells').forEach(cell => {
      let type = 'unknown'
      if (cell.isVertex()) {
        type = 'vertex'
      } else if (cell.isEdge()) {
        type = 'edge'
      }
      console.log(`  ${type} id=${cell.id} geometry=${JSON.stringify(cell.getGeometry())}`)
    })
  })

  // in-place editing
  // ラベルの位置は要調整
  graph.dblClick = (event, cell) => {
    if (cell && graph.getModel().isEdge(cell)) {
      graph.startEditingAtCell(cell)
    }
  }

  // xmlエクスポートのハンドラー
  $('#export-xml').click(() => {
    /*
    const annotations = xmlbuilder.create('annotations')
    const spans = annotations.ele('spans')
    const relations = annotations.ele('relations')

    graph.getChildVertices(parent).forEach(v => {
      let value = v.value
      // valueがnodeになるので変更が必要
      console.log(v.value)
      const [label = '', text = ''] = v.value ? v.value.split('\n') : ''
      spans.importDocument(xmlbuilder.create('item').att({ id: v.id, label, text }))
    })

    console.log(graph.getChildEdges(parent))
    graph.getChildEdges(parent).forEach(edge => {
      relations.importDocument(xmlbuilder.create('item').att({ head: edge.source.id, tail: edge.target.id, label: edge.value ? edge.value : 'undefined' }))
    })

    // consoleにxmlを出力(debug)
    // 独自フォーマット
    const xml = annotations.end({ pretty: true })
    console.log(xml)
    */

    const enc = new mxCodec(mxUtils.createXmlDocument())
    const node = enc.encode(graph.getModel())
    // xml2 = mxUtils.getXml(node)
    xml2 = mxUtils.getPrettyXml(node)

    // consoleにxml2を出力(debug)
    // 内部フォーマット 後ほどインポート可能
    console.log(xml2)

    // ファイルにダウンロードする
    const a = $('<a>').attr({
      // href: URL.createObjectURL(new Blob([xml])),
      href: URL.createObjectURL(new Blob(['<?xml version="1.0"?>\n' + xml2])),
      download: 'annotations.xml'
    }).appendTo($('body'))
    a[0].click()
    a.remove()
  })

  // xmlインポートのハンドラー
  $('#import-xml :file').change(event => {
    const files = Array.from(event.target.files)
    if (files.length >= 1) {
      graph.model.beginUpdate()
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = event => {
          resolve(event.target.result)
        }
        reader.readAsText(files[0])
      }).then(result => {
        return new Blob([result])
      }).then(blob => {
        return window.URL.createObjectURL(blob)
      }).then(url => {
        return mxUtils.load(url).getXml()
      }).then(xmlDoc => {
        graph.model.clear()
        const node = xmlDoc.documentElement
        const dec = new mxCodec(node.ownerDocument)
        dec.decode(node, graph.getModel())
        parent = graph.getDefaultParent()
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        graph.model.endUpdate()
      })
    } else {
      alert('xmlファイルを選択してください。')
    }
  })

  // mxLog.show()
  // for (var i in mxCellRenderer.defaultShapes) {
  //   mxLog.debug(i)
  // }

}

$(window).on('load', () => {
  main(document.getElementById('graphContainer'))
})
