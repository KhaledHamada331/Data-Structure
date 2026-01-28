// stack.js
let stack = [];

// stack.js

function handlePush() {
    const input = document.getElementById('stackInput');
    const val = input.value;

    if (val === "") {
        updateMessage("برجاء إدخال قيمة أولاً!", "#ef4444");
        return;
    }

    stack.push(val);
    renderStack("push");
    
    // السطر ده بيمسح الـ Input بعد الإضافة
    input.value = ""; 
    // وبيرجع الـ Focus للـ Input عشان تكتب الرقم اللي بعده بسرعة
    input.focus(); 
    
    updateMessage(`تمت إضافة ${val} بنجاح`, "#10b981");
}



async function handlePop() {
    if (stack.length === 0) {
        updateMessage("الـ Stack فارغ (Underflow)!", "#ef4444");
        return;
    }

    const items = document.querySelectorAll('.stack-item');
    const lastItem = items[items.length - 1];
    
    lastItem.style.transform = "translateX(200px)";
    lastItem.style.opacity = "0";
    
    await new Promise(r => setTimeout(r, 400));
    
    const removed = stack.pop();
    renderStack();
    updateMessage(`تم حذف ${removed} من القمة`, "#f59e0b");
}

function handlePeek() {
    if (stack.length === 0) {
        updateMessage("لا يوجد عناصر!", "#94a3b8");
        return;
    }
    const top = stack[stack.length - 1];
    updateMessage(`العنصر في القمة هو: ${top}`, "#3b82f6");
    
    const items = document.querySelectorAll('.stack-item');
    const topElement = items[items.length - 1];
    
    // تمييز احترافي باللون الأزرق
   // التعديل ده بيضمن إن العنصر ينور حتى لو الـ border مستخبي
topElement.style.boxShadow = "0 0 20px #3b82f6"; 
topElement.style.backgroundColor = "#3b82f6"; // تغيير لون مؤقت
setTimeout(() => {
    topElement.style.boxShadow = "none";
    topElement.style.backgroundColor = ""; // يرجع للـ gradient الأصلي
}, 1000);
}

function renderStack(action = "") {
    const container = document.getElementById('stack-container');
    if (!container) return; // حماية لو الـ container مش موجود
    
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

    // التأكد إن العنصر موجود قبل التعديل عشان الـ Error يختفي
    const topEl = document.getElementById('top-val');
    if (topEl) {
        topEl.innerText = stack.length > 0 ? stack[stack.length - 1] : "None";
    }
}

function updateMessage(msg, color = "white") {
    const p = document.getElementById('message');
    p.innerText = msg;
    p.style.color = color;
}