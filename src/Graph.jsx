import React, { useEffect, useRef } from "react";

const Graph = () => {
  const graphContainerRef = useRef(null);

  useEffect(() => {
    const mxGraph = window.mxGraph;
    const mxRubberband = window.mxRubberband;

    const graph = new mxGraph(graphContainerRef.current);
    new mxRubberband(graph);

    graph.setHtmlLabels(true);

    const parent = graph.getDefaultParent();

    graph.getModel().beginUpdate();
    try {
      const content = `
        <div style="padding: 10px; text-align: center;">
          <div><b>Name:</b> Unit 1</div>
          <div><b>Inputs:</b> Stream1, Stream2</div>
          <div><b>Outputs:</b> StreamA, StreamB</div>
        </div>
      `;

      graph.insertVertex(parent, null, content, 20, 20, 200, 100);
    } finally {
      graph.getModel().endUpdate();
    }

    return () => {
      graph.destroy();
    };
  }, []);

  return <div ref={graphContainerRef} className="graph"></div>;
}

export default Graph;
