# 🧠 Neural Data Structures & Algorithms Hub

Welcome to the **Neural Hub**, an interactive, high-performance web-based simulator designed to visualize complex Data Structures and Algorithms with a sleek Cyberpunk/Neural aesthetic.

## 🚀 Overview
This project is a modular lab for computer science students and developers to understand how algorithms breathe and function. Each module includes a **Visual Simulator** and a **C++ Core Reference** with high-fidelity syntax highlighting.

## 📂 Project Structure
The project is organized into independent modules for maximum scalability and clean code management:

Neural-Hub/
├── index.html              # The Main Entrance (Dashboard Hub)
├── style.css               # Global Shared Styles & Cyberpunk Theme
├── graph/                  # Graph Theory Module
│   ├── graph.html          # Simulator (BFS, DFS, Dijkstra)
│   ├── graph.js            # Physics & Logic
│   └── code.html           # C++ Reference (Adjacency List, BFS, DFS, Dijkstra)
├── hash-table/             # Hash Table Module
│   ├── hash.html           # Visualizer (Chaining & Collisions)
│   ├── hash.js             # Hashing Logic
│   └── code.html           # C++ Reference (Vector of Lists Chaining)
├── stack/                  # Stack Module (LIFO Visualization)
├── linked-list/            # Linked List Module
└── trees/                  # Trees Module (AVL, B-Plus, BST, Heap)

## 🛠 Featured Modules

### 1. Neural Graph Lab
- Visual Pulse: Watch BFS and DFS pulses travel through nodes dynamically.
- Pathfinding: Real-time Dijkstra shortest path calculation with weighted edges.
- Neural Aesthetics: Glow effects and smooth transitions for node interactions.

### 2. Hash Table Simulator
- Collision Handling: Visualizes Chaining using linked nodes when multiple keys map to the same index.
- Smart Mapping: Implements index = Math.abs(key) % size to handle both positive and negative inputs.
- Real-time Feedback: Interactive Pulse (Insert) button to see the hash function in action.

### 3. C++ Core Reference
- Visual Accuracy: Syntax highlighting designed to match modern IDEs (VS Code Monokai/Cyberpunk).
- Fully English: All logic, comments, and documentation are provided in professional technical English.
- Complexity Badges: Each algorithm displays its Time and Space complexity (e.g., O(V + E) or O(1)).

## 🎨 Design System
- Theme: Deep Space Dark (#060b13) with Neon Cyan (#22d3ee) accents.
- Consistency: Unified Back to Home navigation system across all sub-folders.
- Modular CSS: Flexible containers using height: auto to ensure no code content is cut off.

## 💻 Technical Stack
- Frontend: HTML5, CSS3 (Custom Variables, Flexbox, Grid), JavaScript (ES6+).
- Code Rendering: Custom Manual Syntax Highlighting & Prism.js integration.

## 🏁 How to Run
1. Clone the repository or download the project files.
2. Ensure the folder structure remains intact.
3. Open index.html in any modern browser.
4. Explore the modules via the main dashboard.

---
**Visualizing logic, one pulse at a time.**