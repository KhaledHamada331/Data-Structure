const width = window.innerWidth;
const height = window.innerHeight * 0.7;
let nodes = [], links = [];

const svg = d3.select("#graph-container").append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

// 1. تعريف رأس السهم (Arrowhead)
const defs = svg.append("defs");
defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 25).attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6).attr("markerHeight", 6)
    .append("path").attr("d", "M 0,-5 L 10 ,0 L 0,5").attr("fill", "#22d3ee");

// 2. محرك الفيزياء
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40));

let linkGroup = svg.append("g"), nodeGroup = svg.append("g"), labelGroup = svg.append("g");

function update() {
    const isDirected = document.getElementById("directedToggle")?.checked;

    // تحديث الروابط
    const link = linkGroup.selectAll(".link-parent").data(links, d => `${d.source.id}-${d.target.id}`);
    const linkEnter = link.enter().append("g").attr("class", "link-parent");

    linkEnter.append("line").attr("class", "link")
        .style("stroke", "#22d3ee").style("stroke-opacity", 0.3).style("stroke-width", "2px");
    
    linkEnter.append("text").attr("class", "weight-label")
        .attr("fill", "#64748b").attr("font-size", "12px").attr("dy", -5).attr("text-anchor", "middle");

    const linkMerge = linkEnter.merge(link);
    linkMerge.select("line").attr("marker-end", isDirected ? "url(#arrowhead)" : "");
    linkMerge.select("text").text(d => d.weight > 1 ? d.weight : "");
    link.exit().remove();

    // تحديث النودز
    const node = nodeGroup.selectAll(".node").data(nodes, d => d.id)
        .join("circle").attr("class", "node")
        .attr("r", 18).style("fill", "#0f172a").style("stroke", "#22d3ee").style("stroke-width", "2px")
        .on("dblclick", (e, d) => deleteNode(d.id))
        .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    // تحديث الأسماء
    const label = labelGroup.selectAll(".node-label").data(nodes, d => d.id)
        .join("text").attr("class", "node-label")
        .text(d => d.id).attr("fill", "#fff").attr("font-size", "12px").attr("dx", 22).attr("dy", 5);

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    simulation.on("tick", () => {
        linkMerge.select("line").attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        linkMerge.select("text").attr("x", d => (d.source.x + d.target.x) / 2).attr("y", d => (d.source.y + d.target.y) / 2);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
        label.attr("x", d => d.x).attr("y", d => d.y);
    });
}

// إضافة نود
function addNewNode() {
    const input = document.getElementById("nodeInput"), weightInput = document.getElementById("edgeWeight");
    const name = input.value.trim();
    if (!name) return;
    if (!nodes.find(n => n.id === name)) nodes.push({ id: name, x: width / 2, y: height / 2 });
    if (nodes.length > 1) links.push({ source: nodes[nodes.length - 2].id, target: name, weight: parseInt(weightInput.value) || 1 });
    input.value = ""; weightInput.value = "";
    update();
}

// 3. خوارزمية BFS (البحث بالعرض)
async function runBFS() {
    if (nodes.length === 0) return;
    const isDirected = document.getElementById("directedToggle")?.checked;
    let queue = [nodes[0].id], visited = new Set([nodes[0].id]);

    while (queue.length > 0) {
        let currId = queue.shift();
        await highlightNode(currId);
        links.forEach(l => {
            let neighbor = (l.source.id === currId) ? l.target.id : (!isDirected && l.target.id === currId ? l.source.id : null);
            if (neighbor && !visited.has(neighbor)) {
                visited.add(neighbor); queue.push(neighbor);
            }
        });
    }
}

// 4. خوارزمية DFS (البحث بالعمق)
async function runDFS() {
    if (nodes.length === 0) return;
    const isDirected = document.getElementById("directedToggle")?.checked;
    let stack = [nodes[0].id], visited = new Set();

    while (stack.length > 0) {
        let currId = stack.pop();
        if (!visited.has(currId)) {
            visited.add(currId);
            await highlightNode(currId);
            links.forEach(l => {
                let neighbor = (l.source.id === currId) ? l.target.id : (!isDirected && l.target.id === currId ? l.source.id : null);
                if (neighbor && !visited.has(neighbor)) stack.push(neighbor);
            });
        }
    }
}

// 5. خوارزمية Dijkstra (أقصر مسار)
async function runDijkstra() {
    if (nodes.length < 2) return;
    const startNode = nodes[0].id, endNode = nodes[nodes.length-1].id;
    let distances = {}, prev = {}, pq = new Set(nodes.map(n => n.id));

    nodes.forEach(n => { distances[n.id] = Infinity; prev[n.id] = null; });
    distances[startNode] = 0;

    while (pq.size > 0) {
        let currId = [...pq].reduce((a, b) => distances[a] < distances[b] ? a : b);
        pq.delete(currId);
        if (currId === endNode) break;

        links.forEach(l => {
            if (l.source.id === currId || (!document.getElementById("directedToggle")?.checked && l.target.id === currId)) {
                let neighbor = l.source.id === currId ? l.target.id : l.source.id;
                let alt = distances[currId] + l.weight;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; prev[neighbor] = currId; }
            }
        });
    }
    // تلوين المسار
    let curr = endNode;
    while (curr) { await highlightNode(curr, "#f59e0b"); curr = prev[curr]; }
}

async function highlightNode(id, color = "#22d3ee") {
    svg.selectAll(".node").filter(d => d.id === id)
        .transition().duration(400).style("fill", color)
        .transition().duration(400).style("fill", "#0f172a");
    await new Promise(r => setTimeout(r, 600));
}

function resetGraph() { nodes = []; links = []; update(); }
function deleteNode(id) { nodes = nodes.filter(n => n.id !== id); links = links.filter(l => l.source.id !== id && l.target.id !== id); update(); }
function dragstarted(e) { if (!e.active) simulation.alphaTarget(0.3).restart(); e.subject.fx = e.x; e.subject.fy = e.y; }
function dragged(e) { e.subject.fx = e.x; e.subject.fy = e.y; }
function dragended(e) { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; }

update();