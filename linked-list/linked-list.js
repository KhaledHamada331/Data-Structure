let list = [];

function renderList() {
    const container = document.getElementById('list-container');
    const type = document.getElementById('listType').value;
    container.innerHTML = "";

    list.forEach((val, index) => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        
        // Doubly Arrow (Prev)
        if (type === 'doubly' && index !== 0) {
            nodeDiv.innerHTML += `<span class="arrow">←</span>`;
        }

        nodeDiv.innerHTML += `<div class="node-content">${val}</div>`;

        // Next Arrow
        if (index !== list.length - 1) {
            nodeDiv.innerHTML += `<span class="arrow">→</span>`;
        } else {
            nodeDiv.innerHTML += `<span class="arrow" style="color: grey;">⊘</span>`; // NULL
        }

        container.appendChild(nodeDiv);
    });
}

function insertFront() {
    const val = document.getElementById('nodeInput').value;
    if (!val) return;
    list.unshift(val);
    renderList();
    document.getElementById('nodeInput').value = "";
}

function insertEnd() {
    const val = document.getElementById('nodeInput').value;
    if (!val) return;
    list.push(val);
    renderList();
    document.getElementById('nodeInput').value = "";
}

function popFront() {
    list.shift();
    renderList();
}

function popEnd() {
    list.pop();
    renderList();
}

function changeListType() {
    list = []; // Clear list on type change
    renderList();
    document.getElementById('message').innerText = `Switched to ${document.getElementById('listType').value} list.`;
}