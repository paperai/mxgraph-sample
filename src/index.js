const xmlbuilder = require('xmlbuilder')
const toml = require('toml')


// /**
//  * カラーを登録する
//  * @param {mxGraph} graph 
//  */
// function registerColors (graph) {
//   ;['vertex', 'edge'].forEach(cell => {
//     Object.keys(colorStyles[cell]).forEach(key => {
//       graph.getStylesheet().putCellStyle(key, colorStyles[cell][key])
//     })
//   })
// }

// /**
//  * シェイプを登録する
//  * @param {mxGraph} graph 
//  */
// function registerShapes (graph) {
//   shapeList.forEach(key => {
//     const style = new Object()
//     style[mxConstants.STYLE_SHAPE] = key
//     graph.getStylesheet().putCellStyle(key, style)
//   })
// }

// Program starts here. Creates a sample graph in the
// DOM node with the specified ID. This function is invoked
// from the onLoad event handler of the document (see below).
function main (container) {



  // // Note that we're using the container scrollbars for the graph so that the
  // // container extends to the parent div inside the window
  // var wnd = new mxWindow('mxGraph sample program', container, WINDOW_X, WINDOW_Y, WINDOW_WIDTH, WINDOW_HEIGHT, true, true)

  // wnd.setMaximizable(true)
  // wnd.setResizable(true)
  // wnd.setVisible(true)

  // const editor = new mxEditor()
  // const graph = editor.graph

  // editor.setGraphContainer(container)
  // const config = mxUtils.load('config/keyhandler-commons.xml').getDocumentElement()
  // editor.configure(config)

  // Creates the graph inside the given container
  // var graph = new mxGraph(container)

  // graph.setTooltips(true)
  // graph.setPanning(true)
  // graph.setConnectable(true)
  // graph.setAutoSizeCells(true)
  // graph.setDisconnectOnMove(true)
  // graph.setAllowDanglingEdges(true)

  // graph.autoSizeCellsOnAdd = true

  // // エッジの編集可否の初期設定
  // edgeEnable(false)

  // // セルのラベルの編集を禁止する
  // graph.setCellsEditable(false)

  // // セルのラベルを描画する
  // // セルのattributeを設定しているため
  // graph.convertValueToString = cell => {
  //   if (mxUtils.isNode(cell.value)) {
  //     if (cell.isVertex()) {
  //       return cell.getAttribute('label', '') + '\n' + cell.getAttribute('text', '')
  //     } else {
  //       console.log(cell.getValue())
  //       return cell.getValue()
  //     }
  //   } else {
  //     return cell.getValue()
  //   }
  // }
  
  ////////////////////////////////////////////////////////////////////////////////
  // レイアウト・スタイルは要検討

  // const layout = new mxCircleLayout(graph, 10)

  /*
  // 単独のvertexは無視される
  const layout = new mxCompactTreeLayout(graph, false)
  layout.useBoundingBox = false
  layout.edgeRouting = false
  layout.levelDistance = 30
  layout.nodeDistance = 10
  */

  // const layout = mxHierarchicalLayout(graph)
  
  // const layout = mxSwimlaneLayout(graph)

  // コンポジット 単独では使わない
  // const layout = new mxCompositeLayout(graph)

  // edgとvertexの重なりを解消 ラベルをずらす
  const layout2 = new mxEdgeLabelLayout(graph)

  // 単独のvertexは無視される
  let layout = new mxFastOrganicLayout(graph)
  layout.disableEdgeStyle = false

  // layout.forceConstant = 50
  layout.initialTemp = 100
  layout.radius = 200
  layout.forceConstant = 50
  // layout.useInputOrigin = false
  // layout.resetEdges = false

  /*
  // 基本クラスなので使用しない
  const layout = new mxGraphLayout(graph)
  */

  // const layout = new mxParallelEdgeLayout(graph)

  // const layout = new mxPartitionLayout(graph)

  /*
  // 単独のvertexは無視される
  const layout = new mxRadialTreeLayout(graph)
  layout.levelDistance = 80
  layout.autoRadius = true
  */

  // const layout = new mxStackLayout(graph)

  ////////////////////////////////////////////////////////////////////////////////

  // レイアウトマネージャー
  const layoutMgr = new mxLayoutManager(graph)

  // 自動レイアウト
  // layoutMgr.getLayout = cell => {
  //   if (cell.getChildCount() > 0) {
  //     return layout
  //   }
  // }

  let rubberband = new mxRubberband(graph)
  // new mxKeyHandler(graph)

  // const style = graph.getStylesheet().getDefaultEdgeStyle()
  // style[mxConstants.STYLE_ROUNDED] = true

  // ////////////////////////////////////////////////////////////////////////////////
  // // エッジ・スタイルは要検討
  // // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector
  // // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SideToSide
  // // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom
  // // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation
  // // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.Loop
  // // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SegmentConnector
  // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector
  // ////////////////////////////////////////////////////////////////////////////////

  // graph.alternateEdgeStyle = 'elbow=vertical'

  // // カラースタイルを登録する
  // registerColors(graph)

  // // シェイプを登録する
  // registerShapes(graph)
  
  // mxEvent.disableContextMenu(container)

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  // let parent = graph.getDefaultParent()

  // mxLog.show()

//   // シェイプを select に表示
//   const shape = $('select#shape')
//   shapeList.forEach(key => {
//     $('<option>').attr('value', key).text(key).appendTo(shape)
//   })

//   // スパン追加のハンドラー
//   $('button#add-span').click(event => {
//     addSpan(event, graph)
//   })

//   graph.addListener(mxEvent.CELL_CONNECTED, (g, event) => {
//     // console.log('CELL_CONNECTED')
//     // const source = event.getProperty('source') ? 'source' : 'target'
//     // console.log(`  edge id=${event.getProperty('edge').id} geometry=${JSON.stringify(event.getProperty('edge').getGeometry())}`)
//     // console.log(`  vertex id=${event.getProperty('terminal').id} ${source}, geometry=${JSON.stringify(event.getProperty('terminal').getGeometry())}`)
//   })

//   graph.addListener(mxEvent.CELLS_ADDED, (g, event) => {
//     // console.log('CELLS_ADDED')
//     // event.getProperty('cells').forEach(cell => {
//     //   let type = 'unknown'
//     //   if (cell.isVertex()) {
//     //     type = 'vertex'
//     //   } else if (cell.isEdge()) {
//     //     type = 'edge'
//     //   }
//     //   console.log(`  ${type} id=${cell.id} geometry=${JSON.stringify(cell.getGeometry())}`)
//     // })
//   })

//   // in-place editing
//   // ラベルの位置は要調整
//   graph.dblClick = (event, cell) => {
//     if (cell && graph.getModel().isEdge(cell)) {
//       graph.startEditingAtCell(cell)
//     }
//   }

//   // xmlエクスポートのハンドラー
//   $('button#export-xml').click(event => {
//     exportXml(event, graph)
//   })

//   // xmlインポートのハンドラー
//   $('label#import-xml :file').change(event => {
//     importXml(event, {editor, graph})
//     event.target.value = ''
//   })

//   // pdfannoインポートのハンドラー
//   $('label#import-pdfanno :file').change(event => {
//     graph.model.clear()
//     importPdfanno(event, {editor, graph, layout, layout2})
//     event.target.value = ''
//   })

//   // function edgeEnable(enable) {
//   //   graph.setConnectable(enable)
//   //   graph.setDisconnectOnMove(enable)
//   //   graph.setAllowDanglingEdges(enable)
//   // }

//   $('input#flag-edges').change(event => {
//     const $label = $(event.target).parent()
//     const enable = $label.hasClass('active')
//     $label.find('span').text(enable ? 'Cannot create edges' : 'Can create edges')
//     edgeEnable(!enable)
//   })

//   $('button#action').click(event => {
//     // layout.execute(graph.getDefaultParent())
//     // layout2.execute(graph.getDefaultParent())

//     // const selected = graph.getSelectionCell()
//     // if (selected) {
//     //   layout.root = selected
//     //   layout.execute(graph.getDefaultParent())
//     // }

//     // layout.initialTemp++
//     // layout.reduceTemperature()
//     layout.forceConstant += 10
//     layout.execute(graph.getDefaultParent())
//     layout2.execute(graph.getDefaultParent())
//   })

//   // mxLog.show()
//   // for (var i in mxCellRenderer.defaultShapes) {
//   //   mxLog.debug(i)
//   // }
// }

// /**
//  * 
//  */
// function getVertexColorName() {
//   return Object.keys(colorStyles.vertex)[randomInt(VERTEX_COLOR_STYLE_MAX)]
// }

// /**
//  * 
//  */
// function getEdgeColorName() {
//   return Object.keys(colorStyles.edge)[randomInt(EDGE_COLOR_STYLE_MAX)]
// }

// /**
//  * 
//  * @param {Event} event 
//  * @param {mxGraph} graph 
//  */
// function addSpan(event, graph) {
//   graph.getModel().beginUpdate()

//   try {
//     const color = getVertexColorName()
//     let shape = $('select#shape').val()

//     if (shape === '0') {
//       // シェイプを選択していない場合は、rectangle にする。
//       shape = 'rectangle'
//     }

//     const doc = mxUtils.createXmlDocument()
//     const node = doc.createElement('pdfanno')
//     node.setAttribute('label', $('input#span-label').val())
//     node.setAttribute('text', $('input#span-text').val())
//     node.setAttribute('pdfannoId', randomInt(100))
//     node.setAttribute('textrange', [randomInt(100), randomInt(100)])
//     graph.insertVertex(graph.getDefaultParent(), null, node, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color + ';' + shape)
//   } finally {
//     graph.getModel().endUpdate()
//   }
// }

/**
 * 
 * @param {Event} event 
 * @param {mxGraph} graph 
 */
function exportXml(event, graph) {
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

  console.log(graph.getChildEdges(graph.getDefaultParent()))
  graph.getChildEdges(graph.getDefaultParent()).forEach(edge => {
    relations.importDocument(xmlbuilder.create('item').att({ head: edge.source.id, tail: edge.target.id, label: edge.value ? edge.value : 'undefined' }))
  })

  // consoleにxmlを出力(debug)
  // 独自フォーマット
  const xml2 = annotations.end({ pretty: true })
  console.log(xml2)
  */

  const enc = new mxCodec(mxUtils.createXmlDocument())
  const node = enc.encode(graph.getModel())
  xml = mxUtils.getPrettyXml(node)

  // consoleにxml2を出力(debug)
  // 内部フォーマット 後ほどインポート可能
  console.log(xml)

  // ファイルにダウンロードする
  const a = $('<a>').attr({
    href: URL.createObjectURL(new Blob(['<?xml version="1.0"?>\n' + xml], {type: 'application/xml'})),
    download: 'annotations.xml'
  }).appendTo($('body'))

  try {
    window.setTimeout(() => {
      URL.revokeObjectURL(a[0].href)
    }, 0)
    a[0].click()
    a.remove()
  } catch (e) {
  }
}

/**
 * 
 * @param {Event} event 
 * @param {mxGraph} info 
 */
function importXml(event, info) {
  const editor = info.editor
  const graph = info.graph
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
      // parent = graph.getDefaultParent()
    }).catch(e => {
      console.error(e)
    }).finally(() => {
      graph.model.endUpdate()
      editor.resetHistory()
    })
  } else {
    alert('xmlファイルを選択してください。')
  }
}

/**
 * 
 * @param {*} event 
 * @param {*} info
 */
function importPdfanno(event, info) {
  const editor = info.editor
  const graph = info.graph
  const layout = info.layout
  const layout2 = info.layout2
  const files = Array.from(event.target.files)
  if (files.length >= 1) {
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = event => {
        resolve(event.target.result)
      }
      reader.readAsText(files[0])
    }).then(result => {
      return toml.parse(result)
    }).then(tomlObject => {
      createPdfanno(tomlObject, info)
      layout.execute(graph.getDefaultParent())
      layout2.execute(graph.getDefaultParent())
      editor.resetHistory()
    }).catch(e => {
      console.error(e)
    })
    } else {
    alert('pdfannoファイルを選択してください。')
  }
}

/**
 * 
 * @param {*} info
 */
function createPdfanno(tomlObject, info) {
  const graph = info.graph
  ;['spans', 'relations'].forEach(key => {
    const objs = tomlObject[key]
    if (Array.isArray(objs)) {
      objs.forEach(obj => {
        if (key === 'spans') {
          graph.getModel().beginUpdate()
          try {
            const shape = 'rectangle'
            const color = getVertexColorName()
            const doc = mxUtils.createXmlDocument()
            const node = doc.createElement('pdfanno')
            node.setAttribute('label', obj.label)
            node.setAttribute('text', obj.text)
            node.setAttribute('pdfannoId', obj.id)
            node.setAttribute('textrange', obj.textrange)
            graph.insertVertex(graph.getDefaultParent(), null, node, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color + ';' + shape)
          } finally {
            graph.getModel().endUpdate()
          }
        } else if (key === 'relations') {
          const color = getEdgeColorName()
          const source = findVertex(obj.head, graph)
          const target = findVertex(obj.tail, graph)
          if (source && target) {
            graph.getModel().beginUpdate()
            try {
              graph.insertEdge(graph.getDefaultParent(), null, obj.label, source, target, color)
            } finally {
              graph.getModel().endUpdate()
            }
          }
        }
      })
    }
  })
}

/**
 * VertexをpdfannoIdで探す
 * @param {Integer} id 
 */
function findVertex(id, graph) {
  return graph.getChildVertices(graph.getDefaultParent()).find(cell => {
    return id === cell.getAttribute('pdfannoId', null)
  })
}




// $(window).on('load', () => {
//   main(document.getElementById('graphContainer'))
// })