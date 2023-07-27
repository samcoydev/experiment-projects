let nodes = [];

let edges = [];

const colorGroups = [
    ["#2DD881", "#F56476"],
    ["#5465FF", "#F56476"],
    ["#D8D4F2", "#F06543"],
    ["#05F140", "#F06543"],
    ["#FB8B24", "#D90429"],
    ["#DF2935", "#85CB33"],
]

let colorGroupIndex = 0;
let showLabels = false;
toggleLabels();

const svg = document.getElementById("graph-svg");
const container = document.getElementById("graph-container");
let edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
svg.appendChild(edgeGroup);

function injectMockData(dataName) {
    switch(dataName){
        case 'cities':
            injectData(citiesData);
            break;
        case 'family':
            injectData(familyData);
            break;
        case 'names':
            injectData(namesData);
            break;
        case 'recipes':
            injectData(recipesData);
            break;
    }
}

function injectData(data) {
    clearGraph();
    data.nodes.forEach(node => {
        node = {
            id: node.id,
            data: node.data,
            colorGroupIndex: node.colorGroupIndex,
            element: {},
            x: Math.random() * container.offsetWidth,
            y: Math.random() * container.offsetHeight,
        }

        nodes.push(node);
        createNodeElement(node, colorGroups[node.colorGroupIndex])
    });

    data.edges.forEach(edge => {
        edges.push(edge);
        createEdgeElement(edge);
    });
    console.log(nodes, edges);
}

function clearGraph() {
    nodes = [];
    edges = [];
    svg.innerHTML = "";
    edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(edgeGroup);
}

function toggleLabels() {
    showLabels = document.getElementById("toggle-labels").checked;
    nodes.forEach(node => {setLabelVisible(node)});
}

function setLabelVisible(node) {
    node.element.querySelector(".node-label").style.opacity = showLabels ? "1" : "0";
    node.element.querySelector(".node-label").style.fontSize = showLabels ? "12px" : "0";
}

function setNodePosition(node, x, y) {
    node.element.setAttribute("transform", `translate(${x}, ${y})`);
}

function addNewNode(originNode) {
    const node = {
        id: nodes.length,
        data: "New node",
        colorGroupIndex: originNode ? originNode.colorGroupIndex : colorGroupIndex,
        element: {},
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
    };

    nodes.push(node);
    createNodeElement(node, colorGroups[node.colorGroupIndex])

    if (originNode !== null) {
        const edge = {
            source: originNode.id,
            target: node.id,
        }
        edges.push(edge);
        createEdgeElement(edge);
    } else {
        colorGroupIndex = (colorGroupIndex + 1) % colorGroups.length;
    }
}

function renameData(node) {
    const newName = prompt("Rename Node:", node.data);
    if (newName !== null) {
        node.data = newName;
        node.element.querySelector(".node-label").textContent = newName;
    }
}

// Create the nodes
nodes.forEach(node => {
    createNodeElement(node)
});

// Create the edges
edges.forEach(edge => {
    createEdgeElement(edge);
});

function createNodeElement(node, colorGroup) {
    const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const hoverCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");

    nodeGroup.setAttribute("class", "node-group");
    label.setAttribute("class", "node-label");
    label.setAttribute("x", 0);
    label.setAttribute("y", 50);

    const labelText = document.createTextNode(node.data);
    label.appendChild(labelText);

    circle.setAttribute("class", "node");
    circle.setAttribute("fill", colorGroup[0]);
    circle.setAttribute("r", 25);

    hoverCircle.setAttribute("class", "hover-node");
    hoverCircle.setAttribute("fill", colorGroup[1]);
    hoverCircle.setAttribute("r", 25);

    circle.addEventListener("dblclick", () => addNewNode(node))
    label.addEventListener("click", () => renameData(node))
    nodeGroup.appendChild(label);
    nodeGroup.appendChild(circle);
    nodeGroup.appendChild(hoverCircle);
    svg.appendChild(nodeGroup);
    node.element = nodeGroup;
    makeNodeDraggable(node);
    if (!showLabels)
        setLabelVisible(node);
    setNodePosition(node, node.x, node.y);
}

let dragNode = null;
let dragging = false;

function makeNodeDraggable(node) {
    let circle = node.element.querySelector(".node");
    circle.addEventListener("mousedown", (event) => {
        dragging = true;
        dragNode = node;
        node.xStart = node.x; // Store the initial position for later reference
        node.yStart = node.y;
        node.dragStartX = event.clientX;
        node.dragStartY = event.clientY;
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
        dragNode = null;
    });

    container.addEventListener("mousemove", (event) => {
        if (dragNode === node) {
            const dx = event.clientX - node.dragStartX;
            const dy = event.clientY - node.dragStartY;
            node.x = node.xStart + dx;
            node.y = node.yStart + dy;
            //setNodePosition(node, node.x, node.y);
        }
    });
}

function createEdgeElement(edge) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "edge");
    console.log("line: ", edge, nodes)
    line.setAttribute("x1", nodes[edge.source].x);
    line.setAttribute("y1", nodes[edge.source].y);
    line.setAttribute("x2", nodes[edge.target].x);
    line.setAttribute("y2", nodes[edge.target].y);
    edgeGroup.appendChild(line);
    edge.line = line;
}

// Calculate forces between nodes
const attractionK = .01;
function calculateForces() {
    const k = 200; // Repulsive force constant

    nodes.forEach((node, i) => {
        if (dragging && dragNode === node) return;
        // Calculate repulsive forces
        nodes.forEach((otherNode, j) => {
            if (i !== j) {
                const dx = otherNode.x - node.x;
                const dy = otherNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const repulsiveForce = k / distance; // Inverse square repulsive force
                const repulsiveForceX = distance === 0 ? 0 : repulsiveForce * dx / distance;
                const repulsiveForceY = distance === 0 ? 0 : repulsiveForce * dy / distance;
                node.x -= repulsiveForceX;
                node.y -= repulsiveForceY;
            }
        });

        // Calculate attraction forces
        edges.forEach(edge => {
            if (edge.source === i) {
                const targetNode = nodes[edge.target];
                const dx = targetNode.x - node.x;
                const dy = targetNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const attractionForce = attractionK * distance; // Linear attraction force
                const attractionForceX = distance === 0 ? 0 : attractionForce * dx / distance;
                const attractionForceY = distance === 0 ? 0 : attractionForce * dy / distance;
                node.x += attractionForceX;
                node.y += attractionForceY;
            } else if (edge.target === i) {
                const sourceNode = nodes[edge.source];
                const dx = sourceNode.x - node.x;
                const dy = sourceNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const attractionForce = attractionK * distance; // Linear attraction force
                const attractionForceX = distance === 0 ? 0 : attractionForce * dx / distance;
                const attractionForceY = distance === 0 ? 0 : attractionForce * dy / distance;
                node.x += attractionForceX;
                node.y += attractionForceY;
            }
        });
    });
}

const damping = 0.05; // Damping factor to slow down node movement
const dragSmoothing = 0; // Adjust this value to control the smoothness of the dragging movement

function updatePositions() {
    nodes.forEach(node => {
        if (dragging && dragNode === node) {
            // Smoothly follow the mouse cursor when dragging
            const dx = container.offsetWidth / 2 - node.x;
            const dy = container.offsetHeight / 2 - node.y;
            node.x += dx * dragSmoothing;
            node.y += dy * dragSmoothing;
            setNodePosition(node, node.x, node.y);
        } else {
            // Apply directional force towards the center of the container
            const dx = container.offsetWidth / 2 - node.x;
            const dy = container.offsetHeight / 2 - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply attraction force to center of the container
            const attractionFactor = distance / (distance + 1); // Using a simple linear attraction force
            node.x += dx * attractionFactor * damping;
            node.y += dy * attractionFactor * damping;

            // Ensure nodes stay within the container boundaries
            node.x = Math.max(0, Math.min(container.offsetWidth, node.x));
            node.y = Math.max(0, Math.min(container.offsetHeight, node.y));

            // Update the SVG element with the new position
            setNodePosition(node, node.x, node.y);
        }
    });

    edges.forEach(edge => {
        const sourceNode = nodes[edge.source];
        const targetNode = nodes[edge.target];
        edge.line.setAttribute("x1", sourceNode.x);
        edge.line.setAttribute("y1", sourceNode.y);
        edge.line.setAttribute("x2", targetNode.x);
        edge.line.setAttribute("y2", targetNode.y);
    })
}


// Update node positions and forces periodically
function animate() {
    calculateForces();
    updatePositions();
    requestAnimationFrame(animate);
}
// Start the animation
animate();
