class Node {
    constructor(value) {
        this.value = value;
        this.left = null; this.right = null;
        this.height = 1;
    }
}

let root = null;
const svg = document.getElementById('tree-svg');
const nodeRadius = 22;
const verticalSpacing = 75;

function getHeight(n) { return n ? n.height : 0; }
function getBalance(n) { return n ? getHeight(n.left) - getHeight(n.right) : 0; }

function rightRotate(y) {
    let x = y.left; let T2 = x.right;
    x.right = y; y.left = T2;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    return x;
}

function leftRotate(x) {
    let y = x.right; let T2 = y.left;
    y.left = x; x.right = T2;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    return y;
}

// دالة البحث عن أصغر عنصر (للمسح)
function getMinValueNode(node) {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
}

function insertNode() {
    const input = document.getElementById('nodeInput');
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    root = recursiveInsert(root, val);
    input.value = "";
    renderTree();
}

function deleteNodeBtn() {
    const input = document.getElementById('nodeInput');
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    root = recursiveDelete(root, val);
    input.value = "";
    renderTree();
}

function recursiveInsert(node, val) {
    if (!node) return new Node(val);
    if (val < node.value) node.left = recursiveInsert(node.left, val);
    else if (val > node.value) node.right = recursiveInsert(node.right, val);
    else return node;

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    let balance = getBalance(node);

    if (balance > 1 && val < node.left.value) return rightRotate(node);
    if (balance < -1 && val > node.right.value) return leftRotate(node);
    if (balance > 1 && val > node.left.value) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }
    if (balance < -1 && val < node.right.value) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }
    return node;
}

function recursiveDelete(root, key) {
    if (!root) return root;
    if (key < root.value) root.left = recursiveDelete(root.left, key);
    else if (key > root.value) root.right = recursiveDelete(root.right, key);
    else {
        if ((root.left === null) || (root.right === null)) {
            let temp = root.left ? root.left : root.right;
            if (!temp) { temp = root; root = null; }
            else root = temp;
        } else {
            let temp = getMinValueNode(root.right);
            root.value = temp.value;
            root.right = recursiveDelete(root.right, temp.value);
        }
    }
    if (!root) return root;

    root.height = Math.max(getHeight(root.left), getHeight(root.right)) + 1;
    let balance = getBalance(root);

    if (balance > 1 && getBalance(root.left) >= 0) return rightRotate(root);
    if (balance > 1 && getBalance(root.left) < 0) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }
    if (balance < -1 && getBalance(root.right) <= 0) return leftRotate(root);
    if (balance < -1 && getBalance(root.right) > 0) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }
    return root;
}

function renderTree() {
    svg.innerHTML = "";
    if (!root) return;
    const width = 2000;
    drawEdges(root, width / 2, 60, 350);
    drawNodes(root, width / 2, 60, 350);
}

function drawEdges(node, x, y, xOffset) {
    if (node.left) {
        createCurve(x, y, x - xOffset, y + verticalSpacing);
        drawEdges(node.left, x - xOffset, y + verticalSpacing, xOffset / 1.9);
    }
    if (node.right) {
        createCurve(x, y, x + xOffset, y + verticalSpacing);
        drawEdges(node.right, x + xOffset, y + verticalSpacing, xOffset / 1.9);
    }
}

function createCurve(x1, y1, x2, y2) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${x1} ${y1} C ${x1} ${y1 + 40}, ${x2} ${y2 - 40}, ${x2} ${y2}`;
    path.setAttribute("d", d);
    path.classList.add("edge-line");
    svg.appendChild(path);
}

function drawNodes(node, x, y, xOffset) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x); circle.setAttribute("cy", y); circle.setAttribute("r", nodeRadius);
    circle.classList.add("node-circle");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.classList.add("node-text"); text.textContent = node.value;
    g.appendChild(circle); g.appendChild(text);
    svg.appendChild(g);

    if (node.left) drawNodes(node.left, x - xOffset, y + verticalSpacing, xOffset / 1.9);
    if (node.right) drawNodes(node.right, x + xOffset, y + verticalSpacing, xOffset / 1.9);
}

function resetTree() { root = null; renderTree(); }