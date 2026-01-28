const BUCKET_SIZE = 10;
let hashTable = Array.from({ length: BUCKET_SIZE }, () => []);

function insertKey() {
    const input = document.getElementById('keyInput');
    const val = parseInt(input.value);
    
    if (isNaN(val)) {
        alert("Please enter a valid Neuron ID");
        return;
    }

    const index = Math.abs(val) % BUCKET_SIZE;
    hashTable[index].push(val); // Collision handled by Chaining
    
    input.value = '';
    render();
}

function render() {
    const container = document.getElementById('hash-table-container');
    container.innerHTML = '';

    hashTable.forEach((bucket, i) => {
        const bucketDiv = document.createElement('div');
        bucketDiv.className = 'bucket-row';
        
        const idDiv = document.createElement('div');
        idDiv.className = 'bucket-id';
        idDiv.innerText = `[${i}]`;

        const chainDiv = document.createElement('div');
        chainDiv.className = 'chain-container';

        bucket.forEach(item => {
            const node = document.createElement('div');
            node.className = 'data-node';
            node.innerText = item;
            chainDiv.appendChild(node);
        });

        bucketDiv.appendChild(idDiv);
        bucketDiv.appendChild(chainDiv);
        container.appendChild(bucketDiv);
    });
}

function resetTable() {
    hashTable = Array.from({ length: BUCKET_SIZE }, () => []);
    render();
}