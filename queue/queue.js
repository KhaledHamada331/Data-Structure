let queue = [];

function handleEnqueue() {
    const input = document.getElementById('queueInput');
    const val = input.value;

    if (val === "") {
        updateMessage("Please enter a value first!", "#ef4444");
        return;
    }

    queue.push(val);
    renderQueue("enqueue");
    
    input.value = "";
    input.focus();
    updateMessage(`Added ${val} to the queue`, "#10b981");
}

async function handleDequeue() {
    if (queue.length === 0) {
        updateMessage("Queue Underflow!", "#ef4444");
        return;
    }

    const items = document.querySelectorAll('.queue-item');
    const firstItem = items[0];
    
    // Exit Animation
    firstItem.style.transform = "translateY(-50px)";
    firstItem.style.opacity = "0";
    
    await new Promise(r => setTimeout(r, 400));
    
    const removed = queue.shift();
    renderQueue();
    updateMessage(`Removed ${removed} from front`, "#f59e0b");
}

function renderQueue(action = "") {
    const container = document.getElementById('queue-container');
    container.innerHTML = "";
    
    queue.forEach((el, index) => {
        const div = document.createElement('div');
        div.className = 'queue-item';
        if (action === "enqueue" && index === queue.length - 1) {
            div.classList.add('enqueue-animation');
        }
        div.innerText = el;
        container.appendChild(div);
    });

    document.getElementById('status-val').innerText = queue.length > 0 ? "Active" : "Empty";
}

function updateMessage(msg, color = "white") {
    const p = document.getElementById('message');
    p.innerText = msg;
    p.style.color = color;
}