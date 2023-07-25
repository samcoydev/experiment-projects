const maxDistance = 250;
const minDistance = 200;
const graph = document.getElementById("graph");
const nodeSelect = document.getElementById("nodeSelect");
const nodes = []

let _baseNode = document.getElementById("baseNode")
_baseNode.style.left = window.innerWidth / 2 + "px";
_baseNode.style.top = window.innerHeight / 2 + "px";

function addNode() {
  let newNode = createNode()
  graph.appendChild(newNode);
  drawEdge(getNodeById(nodeSelect.value), newNode);
  nodes.push(newNode);
  addNodeToSelectMenu(newNode);
  applyForceDirectedLayout();
}

function createNode() {
  const selectedNode = getNodeById(nodeSelect.value);

  if (parseInt(selectedNode.getAttribute("children-count")) >= 5) {
    alert("A node cannot have more than 5 child nodes.");
    return;
  }

  let name = prompt("Enter node name");
  let newNode = document.createElement("div");
  const depth = getNodeById(nodeSelect.value).getAttribute("node-depth");

  newNode.classList.add("node")
  newNode.setAttribute("node-depth", parseInt(depth)+1)
  newNode.setAttribute("children-count", 0)
  selectedNode.setAttribute("children-count", parseInt(selectedNode.getAttribute("children-count"))+1)

  //setPosition(newNode);
  let coords = getNodeSpawnPoint(nodeSelect.value);
  newNode.style.left = coords.x + "px";
  newNode.style.top = coords.y + "px";

  newNode.style.scale = 1 - depth*0.15;

  newNode.id = "node-"+name+nodeSelect.options.length;

  newNode.appendChild(document.createTextNode(name));

  //addDraggableFunctionality(newNode);

  return newNode;
}

function applyForceDirectedLayout() {
  const k = Math.sqrt(graph.clientWidth * graph.clientHeight / nodes.length) / 70; // Adjust the division factor as needed
  const damping = 0.9;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    let totalDisplacement = 0;

    for (let node of nodes) {
      let displacement = { x: 0, y: 0 };

      for (let otherNode of nodes) {
        if (node !== otherNode) {
          const dx = otherNode.offsetLeft - node.offsetLeft;
          const dy = otherNode.offsetTop - node.offsetTop;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            const force = k * k / distance;
            displacement.x += force * dx / distance;
            displacement.y += force * dy / distance;
          }
        }
      }

      node.style.left = (node.offsetLeft + damping * displacement.x) + "px";
      node.style.top = (node.offsetTop + damping * displacement.y) + "px";

      totalDisplacement += Math.abs(displacement.x) + Math.abs(displacement.y);
    }

    if (totalDisplacement < 1) {
      break;
    }

    resolveNodeCollisions();
  }
}

function resolveNodeCollisions() {
  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    const rectA = nodeA.getBoundingClientRect();

    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];
      const rectB = nodeB.getBoundingClientRect();

      if (rectA.right >= rectB.left && rectA.left <= rectB.right && rectA.bottom >= rectB.top && rectA.top <= rectB.bottom) {
        const dx = rectA.left - rectB.left;
        const dy = rectA.top - rectB.top;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const overlapX = (rectA.width + rectB.width) / 2 - Math.abs(dx);
        const overlapY = (rectA.height + rectB.height) / 2 - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
          if (overlapX < overlapY) {
            if (dx < 0) {
              nodeA.style.left = (nodeA.offsetLeft - overlapX / 2) + "px";
              nodeB.style.left = (nodeB.offsetLeft + overlapX / 2) + "px";
            } else {
              nodeA.style.left = (nodeA.offsetLeft + overlapX / 2) + "px";
              nodeB.style.left = (nodeB.offsetLeft - overlapX / 2) + "px";
            }
          } else {
            if (dy < 0) {
              nodeA.style.top = (nodeA.offsetTop - overlapY / 2) + "px";
              nodeB.style.top = (nodeB.offsetTop + overlapY / 2) + "px";
            } else {
              nodeA.style.top = (nodeA.offsetTop + overlapY / 2) + "px";
              nodeB.style.top = (nodeB.offsetTop - overlapY / 2) + "px";
            }
          }
        }
      }
    }
  }
}

function setPosition(node) {
  let validPositionFound = false;
  let retryCount = 0;

  for (let retries = 0; retries < 20; retries++) {
    console.log("Finding position for new node. Retried: ", retryCount)
    let coords = getNodeSpawnPoint(nodeSelect.value);
    let overlappingNode = checkNodeOverlap(coords.x, coords.y);

    if (!overlappingNode) {
      node.style.left = coords.x + "px";
      node.style.top = coords.y + "px";
      validPositionFound = true;
      break;
    }
  }

  if (!validPositionFound) {
    alert("Could not find a valid position for the new node. There may not be enough room for that node.");
    node.remove();
  }
}

function adjustNodePosition(x, y, overlappingNode) {
  const overlappingNodeRect = overlappingNode.getBoundingClientRect();
  const overlappingNodeWidth = overlappingNodeRect.width;
  const overlappingNodeHeight = overlappingNodeRect.height;

  // Adjust the position of the new node to avoid overlap
  const adjustedX = x + overlappingNodeWidth; // Add some padding
  const adjustedY = y + overlappingNodeHeight; // Add some padding

  return { x: adjustedX, y: adjustedY };
}

function checkNodeOverlap(x, y) {
  const overlappingNodes = document.getElementsByClassName("node");
  const paddingLimit = 25;

  for (let i = 0; i < overlappingNodes.length; i++) {
    const nodeRect = overlappingNodes[i].getBoundingClientRect();
    const nodeX = nodeRect.left + window.scrollX;
    const nodeY = nodeRect.top + window.scrollY;
    // console.log("-------- New node overlapping with ", overlappingNodes[i].id, "?", x >= nodeX && x <= nodeX + nodeRect.width && y >= nodeY && y <= nodeY + nodeRect.height)
    // console.log("x greater than nodeX?", x >= nodeX)
    // console.log("x less than nodeX + nodeRect.width?", x <= nodeX + nodeRect.width)
    // console.log("y greater than nodeY?", y >= nodeY)
    // console.log("y less than nodeY + nodeRect.height?", y <= nodeY + nodeRect.height)
    if (x >= nodeX && x <= nodeX + nodeRect.width && y >= nodeY && y <= nodeY + nodeRect.height) {
      return overlappingNodes[i];
    }
  }

  return null;
}

function getNodeById(id) {
  return document.getElementById(id);
}

function getNodePosition(node) {
  const nodeRect = node.getBoundingClientRect();
  const selectedNodeCenterX = nodeRect.left + nodeRect.width / 2;
  const selectedNodeCenterY = nodeRect.top + nodeRect.height / 2;

  return { x: selectedNodeCenterX, y: selectedNodeCenterY };
}

function getNodeSpawnPoint(selectedNodeId) {
  const selectedNode = getNodeById(selectedNodeId);
  const coords = getNodePosition(selectedNode);

  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * (maxDistance - minDistance) + minDistance;

  const spawnX = coords.x + distance * Math.cos(angle);
  const spawnY = coords.y + distance * Math.sin(angle);

  return { x: spawnX, y: spawnY };
}

function drawEdge(toNode, fromNode) {
  const svg = document.getElementById("svg");
  const newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  const fromCoords = getNodePosition(fromNode);
  const toCoords = getNodePosition(toNode);

  newLine.setAttribute('id', "edge"+fromNode.id+toNode.id);
  newLine.setAttribute('x1',fromCoords.x.toString());
  newLine.setAttribute('y1',fromCoords.y.toString());
  newLine.setAttribute('x2', toCoords.x.toString());
  newLine.setAttribute('y2', toCoords.y.toString());
  newLine.setAttribute("stroke", "black")

  svg.appendChild(newLine);
}

function addNodeToSelectMenu(node) {
  let nodeSelect = document.getElementById("nodeSelect");
  let newNode = document.createElement("option");
  newNode.value = node.id;
  newNode.innerHTML = node.id;
  nodeSelect.appendChild(newNode);
}
