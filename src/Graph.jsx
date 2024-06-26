import React, { useEffect, useRef } from "react";

const Graph = () => {
  const graphContainerRef = useRef(null);

  useEffect(() => {
    const mxGraph = window.mxGraph;
    const mxConstants = window.mxConstants;
    const mxEdgeStyle = window.mxEdgeStyle;
    const mxRubberband = window.mxRubberband;
    const mxCellState = window.mxCellState;
    const mxClipboard = window.mxClipboard;
    const mxKeyHandler = window.mxKeyHandler;

    const graph = new mxGraph(graphContainerRef.current);
    graph.setConnectable(true);
    graph.setMultigraph(false);
    new mxRubberband(graph);

    const style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_ORTHOGONAL] = true;

    graph.connectionHandler.createEdgeState = function (me) {
      var edge = graph.createEdge(null, null, null, null, null);
      edge.setStyle(
        "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;"
      );
      var edgeState = new mxCellState(
        this.graph.view,
        edge,
        this.graph.getCellStyle(edge)
      );
      return edgeState;
    };

    const keyHandler = new mxKeyHandler(graph);
    keyHandler.bindControlKey(67, () => {
      // Ctrl+C for copy
      mxClipboard.copy(graph);
    });
    keyHandler.bindControlKey(86, () => {
      // Ctrl+V for paste
      mxClipboard.paste(graph);
    });
    keyHandler.bindKey(46, () => {
      // Delete key for delete
      graph.removeCells(graph.getSelectionCells());
    });

    const parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      const v1 = graph.insertVertex(parent, null, "Unit 1", 20, 20, 100, 70);
      const v2 = graph.insertVertex(parent, null, "Unit 2", 240, 20, 100, 70);
      v1.setConnectable(false);
      v2.setConnectable(false);

      const createPort = function (vertex, name, x, y) {
        let port = graph.insertVertex(
          vertex,
          null,
          "x",
          x,
          y,
          10,
          10,
          "port;align=center;verticalAlign=middle;strokeColor=black;fillColor=white"
        );
        port.geometry.offset = new mxPoint(-5, -5);
        port.geometry.relative = true;
        port.setConnectable(true);
        return port;
      };

      createPort(v1, "top", 0.5, 0);
      createPort(v1, "bottom", 0.5, 1);
      createPort(v2, "top", 0.5, 0);
      createPort(v2, "bottom", 0.5, 1);
    } finally {
      graph.getModel().endUpdate();
    }

    return () => {
      graph.destroy();
    };
  }, []);

  return <div ref={graphContainerRef} tabIndex={0} className="graph"></div>;
};

export default Graph;
