import * as d3 from "d3";
import { useEffect, useState } from "react";

import fetchData from "./utils/fetchData";

import "./App.css";
import Network from "./NetworkChart/Network";

// Data
// import links from "./data/links.json";
// import nodes from "./data/nodes.csv";
let nodes_edgesUrl =
  "https://gist.githubusercontent.com/bleonard33/9ebea95f1198afd4e5a89545519e7196/raw/03410dc7831034e5af56f8de668c9387e64aaa3d/nodes_edges.json";
let metadataUrl =
  "https://gist.githubusercontent.com/bleonard33/9ebea95f1198afd4e5a89545519e7196/raw/03410dc7831034e5af56f8de668c9387e64aaa3d/metadata.json";

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const processData = async () => {
      const [nodesEdges, metaData] = await fetchData(
        nodes_edgesUrl,
        metadataUrl
      );

      if (nodesEdges && metaData) {
        const { nodes, edges } = nodesEdges;
        const nodesFiltered = nodes.filter((node) => node.x !== null);
        // Step 1: Create a map of product id to sector
        const productSectorMap = new Map();
        metaData.productHs92.forEach((item) => {
          productSectorMap.set(item.productId, {
            productSector: item.productSector.productId,
            productCode: item.productCode,
            productName: item.productName,
          });
        });

        //
        // const nodesCopy = nodes.map((d) => ({ ...d }));
        const edgesCopy = edges.map((d) => ({ ...d }));
        const nodesMap = new Map();
        // Step 2: Give productSector to nodes
        nodesFiltered.forEach((node) => {
          if (productSectorMap.has(node.productId)) {
            node.productSector = productSectorMap.get(
              node.productId
            ).productSector;
            node.productCode = productSectorMap.get(node.productId).productCode;
            node.productName = productSectorMap.get(node.productId).productName;
            node.x = +node.x;
            node.y = +node.y;
            nodesMap.set(node.productId, node);
          }
        });

        // Step 3: Give x,y from nodes to links
        const links = edgesCopy.map((edge) => {
          return {
            source: nodesMap.get(edge.source) || {},
            target: nodesMap.get(edge.target) || {},
          };
        });

        setGraphData({ nodes: nodesFiltered, links });
      }
    };
    processData();
  }, []);

  return (
    <>
      {/* Name of the Chart */}
      <header>
        <h1 className="text-[3rem] leading-[1.1] uppercase">Product Space Network</h1>
      </header>
      {/* Chart */}
      <section id="network" className="w-full h-full">
        <Network
          data={{
            links: graphData.links,
            nodes: graphData.nodes,
          }}
        />
      </section>
    </>
  );
}

export default App;
