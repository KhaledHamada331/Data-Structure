class BPlusNode {
    constructor(isLeaf = false) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = [];
        this.parent = null;
    }
}

let root = new BPlusNode(true);
let order = 3;
const svg = document.getElementById('tree-svg');

function insertNode() {
    const input = document.getElementById('nodeInput');
    const val = parseInt(input.value);
    order = parseInt(document.getElementById('degreeInput').value);
    if (isNaN(val)) return;

    let leaf = findLeaf(root, val);
    leaf.keys.push(val);
    leaf.keys.sort((a, b) => a - b);

    if (leaf.keys.length >= order) splitLeaf(leaf);

    input.value = "";
    renderTree();
}

function findLeaf(node, val) {
    if (node.isLeaf) return node;
    for (let i = 0; i < node.keys.length; i++) {
        if (val < node.keys[i]) return findLeaf(node.children[i], val);
        if (i === node.keys.length - 1) return findLeaf(node.children[i + 1], val);
    }
}

function splitLeaf(leaf) {
    let mid = Math.floor(order / 2);
    let newLeaf = new BPlusNode(true);
    newLeaf.keys = leaf.keys.splice(mid);
    newLeaf.children[0] = leaf.children[0];
    leaf.children[0] = newLeaf;
    insertIntoParent(leaf, newLeaf.keys[0], newLeaf);
}

function insertIntoParent(oldNode, key, newNode) {
    if (oldNode === root) {
        let newRoot = new BPlusNode(false);
        newRoot.keys = [key];
        newRoot.children = [oldNode, newNode];
        root = newRoot;
        oldNode.parent = root; newNode.parent = root;
        return;
    }
    let parent = oldNode.parent;
    let idx = parent.children.indexOf(oldNode);
    parent.keys.splice(idx, 0, key);
    parent.children.splice(idx + 1, 0, newNode);
    newNode.parent = parent;
    if (parent.keys.length >= order) splitInternal(parent);
}

function splitInternal(node) {
    let mid = Math.floor(node.keys.length / 2);
    let splitKey = node.keys[mid];
    let newNode = new BPlusNode(false);
    newNode.keys = node.keys.splice(mid + 1);
    newNode.children = node.children.splice(mid + 1);
    newNode.children.forEach(c => c.parent = newNode);
    node.keys.pop();
    insertIntoParent(node, splitKey, newNode);
}

function renderTree() {
    svg.innerHTML = "";
    drawNode(root, 1250, 50, 400);
}

function drawNode(node, x, y, xOffset) {
    if (!node) return;
    const nodeW = node.keys.length * 40 + 20;
    const nodeH = 35;
    const vGap = 50; // المسافة الرأسية الملمومة

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x - nodeW/2); rect.setAttribute("y", y);
    rect.setAttribute("width", nodeW); rect.setAttribute("height", nodeH);
    rect.classList.add("bplus-node-rect");
    g.appendChild(rect);

    node.keys.forEach((k, i) => {
        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", x - nodeW/2 + 20 + i*40); t.setAttribute("y", y + 20);
        t.classList.add("bplus-key-text"); t.textContent = k;
        g.appendChild(t);
    });
    svg.appendChild(g);

    if (!node.isLeaf) {
        node.children.forEach((child, i) => {
            const cX = x - xOffset + (i * (xOffset * 2) / (node.children.length - 1));
            const cY = y + nodeH + vGap;
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = `M ${x} ${y + nodeH} C ${x} ${y+nodeH+20}, ${cX} ${cY-20}, ${cX} ${cY}`;
            path.setAttribute("d", d); path.classList.add("bplus-line");
            svg.appendChild(path);
            drawNode(child, cX, cY, xOffset * 0.4);
        });
    }
}
// --- أضف هذه الدوال في نهاية ملف bplus.js ---

function removeNode() {
    const input = document.getElementById('nodeInput');
    const val = parseInt(input.value);
    if (isNaN(val)) return;

    let leaf = findLeaf(root, val);
    let idx = leaf.keys.indexOf(val);
    
    if (idx !== -1) {
        leaf.keys.splice(idx, 1);
        // التحقق من الـ Underflow (باستثناء الـ Root)
        if (leaf !== root && leaf.keys.length < Math.floor(order / 2)) {
            handleUnderflow(leaf);
        }
    } else {
        alert("Value not found in tree!");
    }

    input.value = "";
    renderTree();
}

function handleUnderflow(node) {
    if (node === root) {
        // لو الـ Root بقى فاضي وهو مش Leaf، بننزل بالـ Root درجة لتحت
        if (node.keys.length === 0 && node.children.length > 0) {
            root = node.children[0];
            root.parent = null;
        }
        return;
    }

    let parent = node.parent;
    let idx = parent.children.indexOf(node);
    
    // 1. محاولة الاستلاف (Borrow) من الجار اليمين
    let rightSibling = (idx < parent.children.length - 1) ? parent.children[idx + 1] : null;
    if (rightSibling && rightSibling.keys.length > Math.floor(order / 2)) {
        if (node.isLeaf) {
            node.keys.push(rightSibling.keys.shift());
            parent.keys[idx] = rightSibling.keys[0];
        } else {
            node.keys.push(parent.keys[idx]);
            parent.keys[idx] = rightSibling.keys.shift();
            node.children.push(rightSibling.children.shift());
            node.children[node.children.length - 1].parent = node;
        }
        return;
    }

    // 2. محاولة الاستلاف (Borrow) من الجار الشمال
    let leftSibling = (idx > 0) ? parent.children[idx - 1] : null;
    if (leftSibling && leftSibling.keys.length > Math.floor(order / 2)) {
        if (node.isLeaf) {
            node.keys.unshift(leftSibling.keys.pop());
            parent.keys[idx - 1] = node.keys[0];
        } else {
            node.keys.unshift(parent.keys[idx - 1]);
            parent.keys[idx - 1] = leftSibling.keys.pop();
            node.children.unshift(leftSibling.children.pop());
            node.children[0].parent = node;
        }
        return;
    }

    // 3. الاندماج (Merge) - هنا بنصلح انهيار الشجرة
    if (rightSibling) {
        if (node.isLeaf) {
            node.keys = node.keys.concat(rightSibling.keys);
            node.children[0] = rightSibling.children[0]; // تعديل الـ Leaf link
        } else {
            node.keys.push(parent.keys[idx]);
            node.keys = node.keys.concat(rightSibling.keys);
            node.children = node.children.concat(rightSibling.children);
            node.children.forEach(c => c.parent = node);
        }
        parent.keys.splice(idx, 1);
        parent.children.splice(idx + 1, 1);
    } else if (leftSibling) {
        if (node.isLeaf) {
            leftSibling.keys = leftSibling.keys.concat(node.keys);
            leftSibling.children[0] = node.children[0];
        } else {
            leftSibling.keys.push(parent.keys[idx - 1]);
            leftSibling.keys = leftSibling.keys.concat(node.keys);
            leftSibling.children = leftSibling.children.concat(node.children);
            leftSibling.children.forEach(c => c.parent = leftSibling);
        }
        parent.keys.splice(idx - 1, 1);
        parent.children.splice(idx, 1);
    }

    // تصعيد الـ Underflow للأب
    if (parent.keys.length < Math.floor(order / 2)) {
        handleUnderflow(parent);
    }
}
function resetTree() { root = new BPlusNode(true); renderTree(); }
window.onload = renderTree;