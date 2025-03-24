// Create and append the Fuse.js script dynamically
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0';
document.head.appendChild(script);

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded'); // Debug
    const fileTreeData = JSON.parse('{{{file_tree}}}');
    console.log('File tree data:', fileTreeData);
    initializeFileTree(fileTreeData);
    initializeClock();
    initializeCopyButton();
    lazyLoadVideos();
    initializeSidebar();

    let searchData;

    // Fetch search index
    fetch('/search-index.json')
        .then(response => response.json())
        .then(data => {
            searchData = data;
        })
        .catch(err => console.error('Failed to load search index:', err));

    // Search functionality
    document.getElementById('search-input').addEventListener('input', function(e) {
        const query = e.target.value;

        // Check if Fuse is loaded and searchData is available
        if (typeof Fuse === 'undefined' || !searchData) {
            console.error('Fuse.js not loaded yet or search data unavailable');
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '<p>Loading search functionality, please wait...</p>';
            return;
        }

        const options = {
            keys: ['url', 'content'],
            threshold: 0.3,
        };
        const fuse = new Fuse(searchData, options);
        const results = fuse.search(query);
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        if (results.length > 0) {
            results.forEach(result => {
                const item = result.item;
                const resultElement = document.createElement('div');
                const getName = (file) => file.split('/').pop();
                resultElement.innerHTML = `
                    <h3><a href="/${item.url}">${getName(item.url.replace('.html', ''))}</a></h3>
                `;
                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    });

    initializeDarkModeToggle();
});

// Add a load handler for the script to log when Fuse.js is ready (optional for debugging)
script.onload = () => console.log('Fuse.js loaded successfully');
script.onerror = () => console.error('Failed to load Fuse.js');

// Rest of your functions (initializeSidebar, initializeDarkModeToggle, etc.) remain unchanged
// ... [include the rest of your code here]

function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const resizeHandle = document.getElementById('resize-handle');

    // Get saved sidebar state
    const sidebarState = localStorage.getItem('sidebarState');
    const sidebarWidth = localStorage.getItem('sidebarWidth');

    // Apply saved state if available
    if (sidebarState === 'collapsed') {
        sidebar.classList.add('collapsed');
        main.classList.add('full-width');
    }

    if (sidebarWidth) {
        sidebar.style.width = sidebarWidth + 'px';
        main.style.marginLeft = sidebarWidth + 'px';
    }

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        main.classList.toggle('full-width');

        // Save state
        localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
    });

    // Resize functionality
    let isResizing = false;
    let initialX;
    let initialWidth;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        initialX = e.clientX;
        initialWidth = parseInt(sidebar.offsetWidth);

        // Add event listeners for mouse movement and release
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Prevent text selection during resize
        document.body.style.userSelect = 'none';
    });

    function handleMouseMove(e) {
        if (!isResizing) return;

        const newWidth = initialWidth + (e.clientX - initialX);

        // Set min and max width constraints
        const minWidth = 150;
        const maxWidth = window.innerWidth * 0.6;

        if (newWidth >= minWidth && newWidth <= maxWidth) {
            sidebar.style.width = newWidth + 'px';
            main.style.marginLeft = newWidth + 'px';
        }
    }

    function handleMouseUp() {
        if (!isResizing) return;

        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';

        // Save the new width
        localStorage.setItem('sidebarWidth', sidebar.offsetWidth);
    }
}

function initializeDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.className = savedTheme;

    updateDarkModeButton();

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = body.className;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.className = newTheme;
        localStorage.setItem('theme', newTheme);
        updateDarkModeButton();
    });

    function updateDarkModeButton() {
        const currentTheme = body.className;
        darkModeToggle.textContent = currentTheme === 'dark' ? '🌞' : '🌒';
    }
}

function initializeFileTree(fileTreeData) {
    const fileTreeElement = document.getElementById('file-tree');
    if (!fileTreeElement) return;

    const expandedStateKey = 'fileTreeExpandedState';
    const expandedState = new Map(JSON.parse(localStorage.getItem(expandedStateKey)) || []);

    function saveExpandedState() {
        localStorage.setItem(expandedStateKey, JSON.stringify([...expandedState]));
    }

    function renderFileTreeNode(node, path = '') {
        const list = document.createElement('ul');
        const item = document.createElement('li');
        item.classList.add(node.type);
        list.appendChild(item);

        const currentPath = path ? `${path}/${node.name}` : node.name;

        if (node.type === 'directory' && node.children.length > 0) {
            const directoryWrapper = document.createElement('div');
            directoryWrapper.classList.add('directory-wrapper');
            directoryWrapper.style.display = 'flex';
            directoryWrapper.style.alignItems = 'center';

            const arrow = document.createElement('i');
            arrow.setAttribute('class', 'ph ph-caret-right directory-arrow');
            directoryWrapper.appendChild(arrow);

            const directoryName = document.createElement('span');
            directoryName.setAttribute('class', 'dirname');
            directoryName.textContent = node.name.replaceAll("_", " ").replaceAll("-", " ").replace(".md", "")
            directoryWrapper.appendChild(directoryName);

            item.appendChild(directoryWrapper);

            const childList = document.createElement('ul');
            const isExpanded = expandedState.get(currentPath) || false;

            if (isExpanded) {
                item.classList.add('open');
            } else {
                childList.classList.add('collapsed');
            }

            node.children.forEach(child => {
                const childNode = renderFileTreeNode(child, currentPath);
                childList.appendChild(childNode);
            });

            directoryWrapper.addEventListener('click', function(e) {
                e.stopPropagation();
                const parentLi = this.parentNode;
                const isOpen = parentLi.classList.toggle('open');
                const childrenUl = parentLi.querySelector('ul');
                childrenUl.classList.toggle('collapsed');
                expandedState.set(currentPath, isOpen);
                saveExpandedState();
            });

            item.appendChild(childList);
        } else if (node.type === 'file') {
            item.textContent = node.name.replace(".md", "");
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const path = node.path.replace(/\.md$/, '.html');
                window.location.href = '/' + path;
            });
        }

        return item;
    }

    const rootList = document.createElement('ul');
    fileTreeData.forEach(node => {
        rootList.appendChild(renderFileTreeNode(node));
    });

    fileTreeElement.appendChild(rootList);
}

function initializeClock() {
    const timeElement = document.getElementById('time');
    if (!timeElement) return;

    function updateClock() {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }

    updateClock();
    setInterval(updateClock, 1000);
}

function initializeCopyButton() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.classList.add('copy-button');

        button.addEventListener('click', () => {
            const code = block.querySelector('code')?.textContent || block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                button.textContent = 'Error!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });

        block.style.position = 'relative';

        block.appendChild(button);
    });
}

function lazyLoadVideos() {
    const videos = document.querySelectorAll('.lazy-video');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const sources = video.querySelectorAll('source');

                sources.forEach(source => {
                    source.src = source.dataset.src;
                });

                video.load();
                observer.unobserve(video);
            }
        });
    });

    videos.forEach(video => observer.observe(video));
}
