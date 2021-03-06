// const xmlbuilder = require('xmlbuilder')
const toml = require('toml')
const Utils = require('./utils')
const FastOrganicLayoutDialog = require('./fastOrganicLayoutDialog')
const CompactTreeLayoutDialog = require('./compactTreeLayoutDialog')
const RadialTreeLayoutDialog = require('./radialTreeLayoutDialog')

const MyWindow = require('./mywindow')
// const Dialog = require('./dialog')
// const LayoutDialog = require('./layoutDialog')

// windowの左上コーナーの位置と幅、高さ
// const WINDOW_X = 50
const WINDOW_Y = 46
// const WINDOW_WIDTH = 1200
// const WINDOW_HEIGHT = 600

// ノードの幅と高さ
const VERTEX_WIDTH = 80
const VERTEX_HEIGHT = 30

// 定義しているカラースタイル数
const VERTEX_COLOR_STYLE_MAX = 8
const EDGE_COLOR_STYLE_MAX = 8

// カラースタイル
// 定義しているカラースタイルをランダムにスパンに割り当てる。
const colorStyles = {
  vertex: {
    vcolor1: {
      [mxConstants.STYLE_STROKECOLOR]: '#FFEB3B',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#FFEB3B66'
    },
    vcolor2: {
      [mxConstants.STYLE_STROKECOLOR]: '#FF5722',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#FF572266'
    },
    vcolor3: {
      [mxConstants.STYLE_STROKECOLOR]: '#795548',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#79554866'
    },
    vcolor4: {
      [mxConstants.STYLE_STROKECOLOR]: '#F44336',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#F4433666'
    },
    vcolor5: {
      [mxConstants.STYLE_STROKECOLOR]: '#E91E63',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#E91E6366'
    },
    vcolor6: {
      [mxConstants.STYLE_STROKECOLOR]: '#9C27B0',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#9C27B066'
    },
    vcolor7: {
      [mxConstants.STYLE_STROKECOLOR]: '#3F51B5',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#3F51B566'
    },
    vcolor8: {
      [mxConstants.STYLE_STROKECOLOR]: '#4CAF50',
      [mxConstants.STYLE_FONTCOLOR]: 'black',
      [mxConstants.STYLE_FILLCOLOR]: '#4CAF5066'
    }
  },
  edge: {
    ecolor1: {
      [mxConstants.STYLE_STROKECOLOR]: '#FFEB3B',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor2: {
      [mxConstants.STYLE_STROKECOLOR]: '#FF5722',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor3: {
      [mxConstants.STYLE_STROKECOLOR]: '#795548',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor4: {
      [mxConstants.STYLE_STROKECOLOR]: '#F44336',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor5: {
      [mxConstants.STYLE_STROKECOLOR]: '#E91E63',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor6: {
      [mxConstants.STYLE_STROKECOLOR]: '#9C27B0',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor7: {
      [mxConstants.STYLE_STROKECOLOR]: '#3F51B5',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    },
    ecolor8: {
      [mxConstants.STYLE_STROKECOLOR]: '#4CAF50',
      [mxConstants.STYLE_FONTCOLOR]: 'black'
    }
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

class Editor extends mxEditor {
  constructor(config, container) {
    super(config)
    this.container = container
    this.init()
  }

  /**
   * 
   */
  init () {
    this.createWindow(this.container)

    // this.disableContextMenu = false

    this.setGraphContainer(this.container)

    // Sets the image to be used for creating new connections
    // mxConnectionHandler.prototype.connectImage = new mxImage('images/handle-main.png', 17, 17)
    mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16)

    // ガイドを有効にする
    mxGraphHandler.prototype.guidesEnabled = true

    // Altキーを押している間はガイドをする
    mxGraphHandler.prototype.useGuidesForEvent = event => {
      return mxEvent.isAltDown(event.getEvent())
    };

    // ガイドの色
    mxConstants.GUIDE_COLOR = '#FF0000'

    // ガイドの線幅
    mxConstants.GUIDE_STROKEWIDTH = 1

		// Enables snapping waypoints to terminals
		mxEdgeHandler.prototype.snapToTerminals = true

    this.graph.setTooltips(true)
    this.graph.setPanning(true)
    this.graph.setConnectable(true)
    this.graph.setAutoSizeCells(true)
    this.graph.setDisconnectOnMove(true)
    this.graph.setAllowDanglingEdges(true)

    this.graph.gridSize = 10

    // セルのラベルの編集を禁止する
    this.graph.setCellsEditable(false)

    // エッジの編集可否の初期設定
    this.enableEdge(false)

    // セルのラベルを描画する
    // セルのattributeを設定しているため
    this.graph.convertValueToString = cell => {
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

    this.keyHandler = new mxKeyHandler(this.graph)

		// Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    this.outline = new mxOutline(this.graph, document.getElementById('outlineContainer'))

    // レイアウト・スタイル
    // const layout = new mxCircleLayout(graph, 10)
    // const layout = mxHierarchicalLayout(graph)
    // const layout = mxSwimlaneLayout(graph)
    // this.layout = new mxParallelEdgeLayout(this.graph)
    // const layout = new mxPartitionLayout(graph)
    // const layout = new mxRadialTreeLayout(graph)
    // layout.levelDistance = 80
    // layout.autoRadius = true
    // const layout = new mxStackLayout(graph)

    // FastOrganicLayout
    this.fastOrganicLayout = new mxFastOrganicLayout(this.graph)
    this.fastOrganicLayout.disableEdgeStyle = false
    
    // CompactTreeLayout
    this.compactTreeLayout = new mxCompactTreeLayout(this.graph, true, false)

    // RadialTreeLayout
    this.radialTreeLayout = new mxRadialTreeLayout(this.graph)

    // edgとvertexの重なりを解消 ラベルをずらす
    this.layout2 = new mxEdgeLabelLayout(this.graph)

    ////////////////////////////////////////////////////////////////////////////////

    // エッジ・スタイルを設定
    this.setDefaultEdgeStyle()

    // カラースタイルを登録する
    this.registerColors(this.graph)

    // シェイプを登録する
    this.registerShapes(this.graph)

    // イベント・ハンドラーを登録する
    this.setEventHandlers()

    // mxLog.show()
    // for (var i in mxCellRenderer.defaultShapes) {
    //   mxLog.debug(i)
    // }
  }

  /**
   * エッジ・スタイルは要検討
   * 
   */
  setDefaultEdgeStyle() {
    const style = this.graph.getStylesheet().getDefaultEdgeStyle()
    style[mxConstants.STYLE_ROUNDED] = true

    // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector
    // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SideToSide
    // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom
    // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation
    // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.Loop
    // style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SegmentConnector
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector
  }

  /**
   * 
   * @param {*} cells 
   * @param {*} key 
   * @param {*} value 
   */
  setEdgeStyles(cells, key, value) {
    if (typeof cells === 'string') {
      if (cells === 'all') {
        cells = this.graph.getChildEdges(this.graph.getDefaultParent())
      } else {
        return
      }
    } else {
      return
    }
    mxUtils.setCellStyles(this.graph.getModel(), cells, 'noEdgeStyle', null)
    mxUtils.setCellStyles(this.graph.getModel(), cells, key, value)
  }

  /**
   * カラーを登録する
   * @param {mxGraph} graph 
   */
  registerColors(graph) {
    ;['vertex', 'edge'].forEach(cell => {
      Object.keys(colorStyles[cell]).forEach(key => {
        this.graph.getStylesheet().putCellStyle(key, colorStyles[cell][key])
      })
    })
  }

  /**
   * シェイプを登録する
   * @param {mxGraph} graph 
   */
  registerShapes(graph) {
    shapeList.forEach(key => {
      const style = new Object()
      style[mxConstants.STYLE_SHAPE] = key
      this.graph.getStylesheet().putCellStyle(key, style)
    })
  }

  /**
   * 
   * @param {Boolean} enable 
   */
  enableEdge(enable) {
    this.graph.setConnectable(enable)
    this.graph.setDisconnectOnMove(enable)
    this.graph.setAllowDanglingEdges(enable)
  }
  
  /**
   * 
   * @param {*} container 
   */
  createWindow (container) {
    const iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    const ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    // Note that we're using the container scrollbars for the graph so that the
    // container extends to the parent div inside the window
    // this.wnd = new mxWindow('mxGraph sample program', container, WINDOW_X, WINDOW_Y, WINDOW_WIDTH, WINDOW_HEIGHT, true, true)
    this.wnd = new mxWindow('mxGraph sample program', container, 0, WINDOW_Y, iw, ih - WINDOW_Y, true, true)
    this.wnd.setMaximizable(true)
    this.wnd.setResizable(true)
    this.wnd.setVisible(true)
  }

  /**
   * 
   */
  getVertexColorName() {
    return Object.keys(colorStyles.vertex)[Utils.randomInt(VERTEX_COLOR_STYLE_MAX)]
  }

  /**
   * 
   */
  getEdgeColorName() {
    return Object.keys(colorStyles.edge)[Utils.randomInt(EDGE_COLOR_STYLE_MAX)]
  }


  /**
   * 
   * @param {Boolean} doLayout 
   */
  beforeLoad() {
    // this.layout.forceConstant = 50
  }

  /**
   * 
   * @param {Boolean} doLayout 
   */
  afterLoad(doLayout) {
    if (doLayout) {
      this.fastOrganicLayout.execute(this.graph.getDefaultParent())
      this.layout2.execute(this.graph.getDefaultParent())
    }
    this.resetHistory()
  }

  /**
   * 
   * @param {Event} event 
   */
  addSpan(event) {
    this.graph.getModel().beginUpdate()

    try {
      const color = this.getVertexColorName()
      let shape = $('select#shape').val()

      if (shape === '0') {
        // シェイプを選択していない場合は、rectangle にする。
        shape = 'rectangle'
      }

      const doc = mxUtils.createXmlDocument()
      const node = doc.createElement('pdfanno')
      node.setAttribute('label', $('input#span-label').val())
      node.setAttribute('text', $('input#span-text').val())
      node.setAttribute('pdfannoId', Utils.randomInt(100))
      node.setAttribute('textrange', [Utils.randomInt(100), Utils.randomInt(100)])
      this.graph.insertVertex(this.graph.getDefaultParent(), null, node, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color + ';' + shape)
    } finally {
      this.graph.getModel().endUpdate()
    }
  }

  /**
   * 
   * @param {Event} event 
   */
  exportXml(event) {
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
    const node = enc.encode(this.graph.getModel())
    const xml = mxUtils.getPrettyXml(node)

    // consoleにxml2を出力(debug)
    // 内部フォーマット 後ほどインポート可能
    console.log(xml)

    // ファイルにダウンロードする
    const a = $('<a>').attr({
      href: URL.createObjectURL(new Blob(['<?xml version="1.0"?>\n' + xml], { type: 'application/xml' })),
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
   * @param {*} event 
   */
  importXml(event) {
    const files = Array.from(event.target.files)
    if (files.length >= 1) {
      this.beforeLoad()
      this.graph.model.beginUpdate()
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
        this.graph.model.clear()
        const node = xmlDoc.documentElement
        const dec = new mxCodec(node.ownerDocument)
        dec.decode(node, this.graph.getModel())
        // parent = this.graph.getDefaultParent()
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        this.graph.model.endUpdate()
        this.afterLoad(false)
      })
    } else {
      alert('xmlファイルを選択してください。')
    }
  }

  /**
   * 
   * @param {*} event 
   */
  importPdfanno(event) {
    const files = Array.from(event.target.files)
    if (files.length >= 1) {
      this.beforeLoad()
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = event => {
          resolve(event.target.result)
        }
        reader.readAsText(files[0])
      }).then(result => {
        return toml.parse(result)
      }).then(tomlObject => {
        this.createPdfanno(tomlObject)
        this.afterLoad(true)
      }).catch(e => {
        console.error(e)
      })
    } else {
      alert('pdfannoファイルを選択してください。')
    }
  }

  /**
   * 
   * @param {*} tomlObject 
   */
  createPdfanno(tomlObject) {
    ;['spans', 'relations'].forEach(key => {
      const objs = tomlObject[key]
      if (Array.isArray(objs)) {
        objs.forEach(obj => {
          if (key === 'spans') {
            this.graph.getModel().beginUpdate()
            try {
              const shape = 'rectangle'
              const color = this.getVertexColorName()
              const doc = mxUtils.createXmlDocument()
              const node = doc.createElement('pdfanno')
              node.setAttribute('label', obj.label)
              node.setAttribute('text', obj.text)
              node.setAttribute('pdfannoId', obj.id)
              node.setAttribute('textrange', obj.textrange)
              this.graph.insertVertex(this.graph.getDefaultParent(), null, node, 0, 0, VERTEX_WIDTH, VERTEX_HEIGHT, color + ';' + shape)
            } finally {
              this.graph.getModel().endUpdate()
            }
          } else if (key === 'relations') {
            const color = this.getEdgeColorName()
            const source = this.findVertex(obj.head)
            const target = this.findVertex(obj.tail)
            if (source && target) {
              this.graph.getModel().beginUpdate()
              try {
                this.graph.insertEdge(this.graph.getDefaultParent(), null, obj.label, source, target, color)
              } finally {
                this.graph.getModel().endUpdate()
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
  findVertex(id) {
    return this.graph.getChildVertices(this.graph.getDefaultParent()).find(cell => {
      return id === cell.getAttribute('pdfannoId', null)
    })
  }

  /**
   * 
   */
  setEventHandlers() {
    // シェイプを select に表示
    const shape = $('select#shape')
    shapeList.forEach(key => {
      $('<option>').attr('value', key).text(key).appendTo(shape)
    })

    // スパン追加のハンドラー
    $('button#add-span').click(event => {
      this.addSpan(event)
    })

    this.graph.addListener(mxEvent.CELL_CONNECTED, (g, event) => {
      // console.log('CELL_CONNECTED')
      // const source = event.getProperty('source') ? 'source' : 'target'
      // console.log(`  edge id=${event.getProperty('edge').id} geometry=${JSON.stringify(event.getProperty('edge').getGeometry())}`)
      // console.log(`  vertex id=${event.getProperty('terminal').id} ${source}, geometry=${JSON.stringify(event.getProperty('terminal').getGeometry())}`)
    })

    this.graph.addListener(mxEvent.CELLS_ADDED, (g, event) => {
      // console.log('CELLS_ADDED')
      // event.getProperty('cells').forEach(cell => {
      //   let type = 'unknown'
      //   if (cell.isVertex()) {
      //     type = 'vertex'
      //   } else if (cell.isEdge()) {
      //     type = 'edge'
      //   }
      //   console.log(`  ${type} id=${cell.id} geometry=${JSON.stringify(cell.getGeometry())}`)
      // })
    })

    // in-place editing
    // ラベルの位置は要調整
    this.graph.dblClick = (event, cell) => {
      if (cell && this.graph.getModel().isEdge(cell)) {
        this.graph.startEditingAtCell(cell)
      }
    }

    // xmlエクスポートのハンドラー
    $('button#export-xml').click(event => {
      this.exportXml(event)
    })

    // xmlインポートのハンドラー
    $('label#import-xml :file').change(event => {
      this.importXml(event)
      event.target.value = ''
    })

    // pdfannoインポートのハンドラー
    $('label#import-pdfanno :file').change(event => {
      this.graph.model.clear()
      this.importPdfanno(event)
      event.target.value = ''
    })

    // this.setEdgeStyles('all', mxConstants.STYLE_EDGE, mxConstants.EDGESTYLE_ORTHOGONAL)

    // FastOrganicLayout
    $('button#fast-organic-layout').click(event => {
      new FastOrganicLayoutDialog('FastOrganicLayout', this.graph, this.fastOrganicLayout, {
        onApply: () => {
          this.fastOrganicLayout.execute(this.graph.getDefaultParent())
        } 
      }).show()
    })

    // CompactTreeLayout
    $('button#compact-tree-layout').click(event => {
      new CompactTreeLayoutDialog('CompactTreeLayout', this.graph, this.compactTreeLayout, {
        onApply: () => {
          this.compactTreeLayout.execute(this.graph.getDefaultParent())
        } 
      }).show()
    })

    // RadialTreeLayout
    $('button#radial-tree-layout').click(event => {
      new RadialTreeLayoutDialog('RadialTreeLayout', this.graph, this.radialTreeLayout, {
        onApply: () => {
          this.radialTreeLayout.execute(this.graph.getDefaultParent())
        } 
      }).show()
    })

    $('input#flag-edges').change(event => {
      const $label = $(event.target).parent()
      const enable = $label.hasClass('active')
      $label.find('span').text(enable ? 'Cannot create edges' : 'Can create edges')
      this.enableEdge(!enable)
    })

    $('button#action').click(event => {

      /*
      const selected = graph.getSelectionCell()
      if (selected) {
        layout.root = selected
        layout.execute(graph.getDefaultParent())
      }
      */

      /* 
      const lo = new mxParallelEdgeLayout(this.graph)
      lo.execute(this.graph.getDefaultParent())
      */

      /*
      const lo = new mxEdgeLabelLayout(this.graph)
      lo.execute(this.graph.getDefaultParent())
      */

      /*
      var div1 = document.createElement('div1')
      const wnd1 = new MyWindow('Test1', div1, 10, 10, 400, 300, {styles:{zIndex: 9001}})
      wnd1.show()

      var div2 = document.createElement('div2')
      const wnd2 = new MyWindow('Test2', div2, 10, 10, 400, 300, {styles:{zIndex: 9002}})
      wnd2.show()

      var div3 = document.createElement('div3')
      const wnd3 = new MyWindow('Test3', div3, 10, 10, 400, 300, {styles:{zIndex: 10}})
      wnd3.show()

      var div4 = document.createElement('div4')
      const wnd4 = new MyWindow('Test4', div4, 10, 10, 400, 300, {styles:{zIndex: 11}})
      wnd4.show()
      */

      /*
      const div1 = document.createElement('div')
      const dialog = new Dialog('Dialog!', div1, this.graph, false)
      // dialog.show(200, 100)
      dialog.show(null, null)
      */

      /*
      this.layout.aaa = 1
      this.layout.bbb = false

      const dialog = new LayoutDialog('Dialog!', this.graph, this.layout, [
        {name: 'aaa', type: 'text'},
        {name: 'bbb', type: 'checkbox'},
      ], {
        onApply: () => {
          console.log(dialog)
          console.log(dialog.items)
        }
      })
      dialog.show()
      */






      alert('未実装')
    })
  }
}

module.exports = Editor
