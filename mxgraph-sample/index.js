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

/**
 * 0 <= random < max の範囲の整数の乱数を生成。
 * @param {Integer} max 
 */
function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
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
  } else {
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

    var layout = new mxParallelEdgeLayout(graph)
    var layoutMgr = new mxLayoutManager(graph)

    layoutMgr.getLayout = cell => {
      if (cell.getChildCount() > 0) {
        return layout
      }
    }

    var rubberband = new mxRubberband(graph)
    new mxKeyHandler(graph)

    // カラースタイルを設定
    Object.keys(colorStyles).forEach(key => {
      graph.getStylesheet().putCellStyle(key, colorStyles[key])
    })

    var style = graph.getStylesheet().getDefaultEdgeStyle()
    style[mxConstants.STYLE_ROUNDED] = true

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

    // スパン追加のハンドラー
    $('#add-span').click(() => {
      graph.getModel().beginUpdate()
      try {
        const label = $('#span-label').val() + '\n' + $('#span-text').val()
        const color = Object.keys(colorStyles)[randomInt(COLOR_STYLE_MAX)]
        graph.insertVertex(parent, null, label, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color)
      } finally {
        graph.getModel().endUpdate()
      }
    })

    graph.addListener(mxEvent.CELL_CONNECTED, (g, event) => {
      console.log('CELL_CONNECTED')
      const props = event.properties
      const source = props.source ? 'source' : 'target'
      console.log(`  edge id=${props.edge.id} geometry=${JSON.stringify(props.edge.geometry)}`)
      console.log(`  vertex id=${props.terminal.id} ${source}, geometry=${JSON.stringify(props.terminal.geometry)}`)
    })

    graph.addListener(mxEvent.CELLS_ADDED, (g, event) => {
      console.log('CELLS_ADDED')
      event.properties.cells.forEach(cell => {
        let type = 'unknown'
        if (cell.vertex) {
          type = 'vertex'
        } else if (cell.edge) {
          type = 'edge'
        }
        console.log(`  ${type} id=${cell.id} geometry=${JSON.stringify(cell.geometry)}`)
        })
    })

    graph.dblClick = (event, cell) => {
      if (cell && graph.model.isEdge(cell)) {
        graph.startEditingAtCell(cell)
      }
    }

    // xmlエクスポートのハンドラー
    $('#export-xml').click(() => {

      const annotations = xmlbuilder.create('annotations')
      const spans = annotations.ele('spans')
      const relations = annotations.ele('relations')

      // console.log(graph.getChildVertices(parent))

      graph.getChildVertices(parent).forEach(v => {
        let value = v.value
        let label = '', text = ''
        if (value.length > 0) {
          let vv = value.split('\n')
          if (vv[0]) {
            label = vv[0]
          }
          if (vv[1]) {
            text = vv[1]
          }
        }

        // console.log(`id=${v.id} label=${label} text=${text}`)
        spans.importDocument(xmlbuilder.create('item').att({id: v.id, label, text}))
      })

      // console.log(graph.getChildEdges(parent))

      graph.getChildEdges(parent).forEach(edge => {
        relations.importDocument(xmlbuilder.create('item').att({head: edge.source.id, tail: edge.target.id, label: 'undefined'}))
      })

      console.log(annotations.end({ pretty: true }))
    })
  }
}

$(() => {
  main(document.getElementById('graphContainer'))
})
