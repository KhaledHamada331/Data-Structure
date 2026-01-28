// stack.js
let stack = [];

function handlePush() {
    const input = document.getElementById('stackInput');
    const val = input.value;

    if (val === "") {
        updateMessage("Please enter a value first!", "#ef4444");
        return;
    }

    stack.push(val);
    renderStack("push");
    
    // Clear input and refocus for rapid entry
    input.value = ""; 
    input.focus(); 
    
    updateMessage(`Successfully added: ${val}`, "#10b981");
}

async function handlePop() {
    if (stack.length === 0) {
        updateMessage("Stack Underflow! The stack is empty.", "#ef4444");
        return;
    }

    const items = document.querySelectorAll('.stack-item');
    const lastItem = items[items.length - 1];
    
    // Smooth exit animation
    lastItem.style.transform = "translateX(200px)";
    lastItem.style.opacity = "0";
    
    await new Promise(r => setTimeout(r, 400));
    
    const removed = stack.pop();
    renderStack();
    updateMessage(`Removed ${removed} from Top`, "#f59e0b");
}

function handlePeek() {
    if (stack.length === 0) {
        updateMessage("No elements in stack!", "#94a3b8");
        return;
    }
    const top = stack[stack.length - 1];
    updateMessage(`Top Element: ${top}`, "#3b82f6");
    
    const items = document.querySelectorAll('.stack-item');
    const topElement = items[items.length - 1];
    
    // Visual Highlight for Peek action
    topElement.style.boxShadow = "0 0 20px #3b82f6"; 
    topElement.style.backgroundColor = "#3b82f6"; 
    
    setTimeout(() => {
        topElement.style.boxShadow = "none";
        topElement.style.backgroundColor = ""; 
    }, 1000);
}

function renderStack(action = "") {
    const container = document.getElementById('stack-container');
    if (!container) return; 
    
    container.innerHTML = "";
    
    stack.forEach((el, index) => {
        const div = document.createElement('div');
        div.className = 'stack-item';
        if (action === "push" && index === stack.length - 1) {
            div.classList.add('push-animation');
        }
        div.innerText = el;
        container.appendChild(div);
    });

    // Update Top indicator safely
    const topEl = document.getElementById('top-val');
    if (topEl) {
        topEl.innerText = stack.length > 0 ? stack[stack.length - 1] : "None";
    }
}

function updateMessage(msg, color = "white") {
    const p = document.getElementById('message');
    if (p) {
        p.innerText = msg;
        p.style.color = color;
    }
}