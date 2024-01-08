// // import gsap from "gsap";
// // import * as d3 from "d3";
// const nodeMap = new Map(data.nodes.map((node) => [node.productId, node]));

//   // Create sequences of node-link-node
//   const sequences = data.links.map((link) => {
//     return {
//       sourceNode: nodeMap.get(link.source.productId),
//       link: link,
//       targetNode: nodeMap.get(link.target.productId)
//     };
//   });
// function calculateLinkLength(linkData) {
//     const dx = linkData.target.x - linkData.source.x;
//     const dy = linkData.target.y - linkData.source.y;
//     return Math.sqrt(dx * dx + dy * dy);
//   }
//   // Function to group sequences into clusters
//   function groupIntoClusters(sequences, clusterSize) {
//     const clusters = [];
//     for (let i = 0; i < sequences.length; i += clusterSize) {
//       clusters.push(sequences.slice(i, i + clusterSize));
//     }
//     return clusters;
//   }

//   // Group sequences into clusters of a specified size
//   const clusterSize = 300; // Adjust this to control the number of sequences per cluster
//   const clusters = groupIntoClusters(sequences, clusterSize);

//   // Initialize GSAP timeline
//   const tl = gsap.timeline();

//   // Set initial state for links
//   d3.selectAll("line").each(function () {
//     const totalLength = calculateLinkLength(d3.select(this).data()[0]);
//     d3.select(this)
//       .attr("stroke-dasharray", totalLength + " " + totalLength)
//       .attr("stroke-dashoffset", totalLength);
//   });

//   // Adjusted duration values for faster animation
//   const nodeDuration = 0.6;
//   const linkDuration = 1.2;
//   const clusterStaggerTime = 0.5; // Time between the start of each cluster

//   // Animate each cluster
//   clusters.forEach((cluster, clusterIndex) => {
//     cluster.forEach((seq) => {
//       const clusterStartTime = clusterIndex * clusterStaggerTime;

//       // Animate source node
//       tl.to(
//         d3
//           .selectAll("circle")
//           .filter((d) => d === seq.sourceNode)
//           .nodes(),
//         {
//           duration: nodeDuration,
//           opacity: 1,
//           ease: "power1.inOut"
//         },
//         clusterStartTime
//       );

//       // Animate link
//       tl.fromTo(
//         d3
//           .selectAll("line")
//           .filter((d) => d === seq.link)
//           .nodes(),
//         {
//           strokeDashoffset: calculateLinkLength(seq.link)
//         },
//         {
//           duration: linkDuration,
//           strokeDashoffset: 0,
//           ease: "power1.inOut"
//         },
//         clusterStartTime + nodeDuration
//       );

//       // Animate target node
//       tl.to(
//         d3
//           .selectAll("circle")
//           .filter((d) => d === seq.targetNode)
//           .nodes(),
//         {
//           duration: nodeDuration,
//           opacity: 1,
//           ease: "power1.inOut"
//         },
//         clusterStartTime + nodeDuration + linkDuration
//       );
//     });
//   });