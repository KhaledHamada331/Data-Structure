class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

let root = null;
const svg = document.getElementById('tree-svg');
const messageEl = document.getElementById('message');

// إعدادات الرسم
const nodeRadius = 25;
const verticalSpacing = 80;

/** 1. إضافة عقدة جديدة **/
function insertNode() {
    const input = document.getElementById('nodeInput');
    const val = parseInt(input.value);
    
    if (isNaN(val)) {
        updateMessage("Please enter a valid number!", "red");
        return;
    }

    if (search(root, val)) {
        updateMessage(`Value ${val} already exists!`, "#fbbf24");
        return;
    }

    root = recursiveInsert(root, val);
    updateMessage(`Inserted ${val} successfully.`, "#10b981");
    input.value = "";
    renderTree();
}

function recursiveInsert(node, val) {
    if (!node) return new Node(val);
    
    if (val < node.value) {
        node.left = recursiveInsert(node.left, val);
    } else {
        node.right = recursiveInsert(node.right, val);
    }
    return node;
}

/** 2. البحث عن عقدة **/
function search(node, val) {
    if (!node) return false;
    if (node.value === val) return true;
    return val < node.value ? search(node.left, val) : search(node.right, val);
}

/** 3. حذف عقدة (Manual Logic) **/
function handleDelete() {
    const val = parseInt(document.getElementById('nodeInput').value);
    if (isNaN(val)) return;

    if (!search(root, val)) {
        updateMessage(`Value ${val} not found!`, "#ef4444");
        return;
    }

    root = recursiveDelete(root, val);
    updateMessage(`Deleted ${val} from tree.`, "#ef4444");
    renderTree();
}

function recursiveDelete(node, val) {
    if (!node) return null;

    if (val < node.value) {
        node.left = recursiveDelete(node.left, val);
    } else if (val > node.value) {
        node.right = recursiveDelete(node.right, val);
    } else {
        // وجدنا العقدة المطلوب حذفها
        // الحالة 1: العقدة ورقة (Leaf) أو لها ابن واحد
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // الحالة 2: العقدة لها ابنان (نجيب أصغر عنصر في الناحية اليمين)
        let minNode = findMin(node.right);
        node.value = minNode.value;
        node.right = recursiveDelete(node.right, minNode.value);
    }
    return node;
}

function findMin(node) {
    while (node.left) node = node.left;
    return node;
}

/** 4. رسم الشجرة (Visual Rendering) **/
function renderTree() {
    svg.innerHTML = ""; // تنظيف الـ SVG
    if (!root) return;
    
    // رسم الروابط (Lines) أولاً عشان تكون خلف الدوائر
    drawEdges(root, svg.clientWidth / 2, 50, svg.clientWidth / 4);
    // رسم العقد (Nodes)
    drawNodes(root, svg.clientWidth / 2, 50, svg.clientWidth / 4);
}

function drawEdges(node, x, y, xOffset) {
    if (node.left) {
        const nextX = x - xOffset;
        const nextY = y + verticalSpacing;
        createLine(x, y, nextX, nextY);
        drawEdges(node.left, nextX, nextY, xOffset / 1.8);
    }
    if (node.right) {
        const nextX = x + xOffset;
        const nextY = y + verticalSpacing;
        createLine(x, y, nextX, nextY);
        drawEdges(node.right, nextX, nextY, xOffset / 1.8);
    }
}

function drawNodes(node, x, y, xOffset) {
    createNodeUI(x, y, node.value);
    if (node.left) drawNodes(node.left, x - xOffset, y + verticalSpacing, xOffset / 1.8);
    if (node.right) drawNodes(node.right, x + xOffset, y + verticalSpacing, xOffset / 1.8);
}

/** أدوات مساعدة للـ SVG **/
function createLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.classList.add("edge-line");
    svg.appendChild(line);
}

function createNodeUI(x, y, val) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x); circle.setAttribute("cy", y);
    circle.setAttribute("r", nodeRadius);
    circle.classList.add("node-circle");
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.classList.add("node-text");
    text.textContent = val;
    
    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
}

function updateMessage(msg, color) {
    messageEl.textContent = msg;
    messageEl.style.color = color;
}

function resetTree() {
    root = null;
    renderTree();
    updateMessage("Tree cleared.", "#94a3b8");
}

// تعديل حجم الـ SVG عند تغيير حجم المتصفح
window.addEventListener('resize', renderTree);