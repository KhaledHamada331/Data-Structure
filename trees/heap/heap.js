let heap = []; // المصفوفة الأساسية
const svg = document.getElementById('heap-svg');
const arrayContainer = document.getElementById('array-container');
const nodeRadius = 22;
const verticalSpacing = 80;

// 1. حسابات الـ Indexing (أصح لوجيك)
const getParent = (i) => Math.floor((i - 1) / 2);
const getLeft = (i) => 2 * i + 1;
const getRight = (i) => 2 * i + 2;

// 2. إضافة عنصر جديد (Insert)
function insertNode() {
    const input = document.getElementById('nodeInput');
    const val = parseInt(input.value);
    if (isNaN(val)) return;

    heap.push(val); // بنضيفه في آخر الـ Array
    heapifyUp(heap.length - 1); // بنطلعه لمكانه الصح
    
    input.value = "";
    renderAll();
}

// 3. ترتيب للأعلى (Heapify Up)
function heapifyUp(index) {
    while (index > 0) {
        let parentIndex = getParent(index);
        if (heap[index] > heap[parentIndex]) { // Max Heap Logic
            [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]]; // Swap
            index = parentIndex;
        } else {
            break;
        }
    }
}

// 4. حذف الـ Root (Extract Max)
function extractRoot() {
    if (heap.length === 0) return;
    if (heap.length === 1) {
        heap.pop();
    } else {
        heap[0] = heap.pop(); // بنجيب آخر واحد فوق
        heapifyDown(0); // بننزله لمكانه الصح
    }
    renderAll();
}

// 5. ترتيب للأسفل (Heapify Down)
function heapifyDown(index) {
    let largest = index;
    let left = getLeft(index);
    let right = getRight(index);

    if (left < heap.length && heap[left] > heap[largest]) largest = left;
    if (right < heap.length && heap[right] > heap[largest]) largest = right;

    if (largest !== index) {
        [heap[index], heap[largest]] = [heap[largest], heap[index]];
        heapifyDown(largest);
    }
}

// 6. الرسم (Rendering)
function renderAll() {
    renderTree();
    renderArray();
}

function renderTree() {
    svg.innerHTML = "";
    if (heap.length === 0) return;

    const width = svg.clientWidth || 800;
    // بنرسم الروابط أولاً
    drawEdges(0, width / 2, 50, width / 4);
    // ثم العقد
    drawNodes(0, width / 2, 50, width / 4);
}

function drawEdges(i, x, y, xOffset) {
    let left = getLeft(i);
    let right = getRight(i);

    if (left < heap.length) {
        createLine(x, y, x - xOffset, y + verticalSpacing);
        drawEdges(left, x - xOffset, y + verticalSpacing, xOffset / 2);
    }
    if (right < heap.length) {
        createLine(x, y, x + xOffset, y + verticalSpacing);
        drawEdges(right, x + xOffset, y + verticalSpacing, xOffset / 2);
    }
}

function drawNodes(i, x, y, xOffset) {
    if (i >= heap.length) return;

    createNodeUI(x, y, heap[i], i);
    
    drawNodes(getLeft(i), x - xOffset, y + verticalSpacing, xOffset / 2);
    drawNodes(getRight(i), x + xOffset, y + verticalSpacing, xOffset / 2);
}

// 7. رسم الـ Array (المربعات اللي تحت)
// تعديل بسيط في رسم المصفوفة عشان تنور لما نضيف
function renderArray() {
    arrayContainer.innerHTML = "";
    heap.forEach((val, index) => {
        const div = document.createElement('div');
        div.className = 'array-item';
        // لو ده أخر عنصر تم إضافته خليه ينور
        if (index === heap.length - 1) div.style.animation = "glow-pulse 1s";
        
        div.innerHTML = `
            ${val}
            <span class="array-index">${index}</span>
        `;
        arrayContainer.appendChild(div);
    });
}

function createLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.classList.add("edge-line");
    svg.appendChild(line);
}

function createNodeUI(x, y, val, index) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x); circle.setAttribute("cy", y); circle.setAttribute("r", nodeRadius);
    circle.classList.add("node-circle");
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.classList.add("node-text");
    text.textContent = val;

    g.appendChild(circle); g.appendChild(text);
    svg.appendChild(g);
}

function resetHeap() { heap = []; renderAll(); }
window.onresize = renderAll; // عشان لو الشاشة صغرت الرسمة تتظبط