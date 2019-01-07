import React, { Component } from 'react'
import Quagga from 'quagga'
import './Scanner.css'

class Scanner extends Component {
    constructor(props) {
      super(props)

      this._onDetected = this._onDetected.bind(this)
    }

    render() {
        return (
            <div id="interactive" className="viewport">
              <video class="videoCamera" autoplay="true" preload="auto" src="" muted="true" playsinline="true"/>
              <canvas class="drawingBuffer"/>
            </div>
        )
    }

    componentDidMount() {
        Quagga.init({
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facing: "environment"
                },
                area: { // defines rectangle of the detection/localization area
                  top: "15%",    // top offset
                  right: "15%",  // right offset
                  left: "15%",   // left offset
                  bottom: "15%"  // bottom offset
                }
            },
            locator: {
                patchSize: "x-large",
                halfSample: true
            },
            numOfWorkers: 2,
            decoder: {
                readers : [ "ean_reader"],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true
                        }
                    }
            },
            locate: true
        }, function(err) {
            if (err) {
                return console.log(err)
            }
            Quagga.start()
        })

        Quagga.onProcessed(function (result) {
                var drawingCtx = Quagga.canvas.ctx.overlay
                var drawingCanvas = Quagga.canvas.dom.overlay

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")))
                        result.boxes.filter(function (box) {
                            return box !== result.box
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 })
                        })
                    }
                }
            })

        Quagga.onDetected(this._onDetected)
    }

    componentWillUnmount() {
        Quagga.offDetected(this._onDetected)
        Quagga.stop()
    }

    _onDetected(result) {
        if(this.props.onDetected(result)) {
          Quagga.stop()  
        }
    }
}

export default Scanner
