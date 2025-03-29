document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded');
    const fileTreeData = JSON.parse('{{{file_tree}}}');
    console.log('File tree data:', fileTreeData);
    initializeFileTree(fileTreeData);
    lazyLoadVideos();
    applyTheme();

    /* let searchData;
    const sidebar = document.getElementById('sidebar');
    const divider = document.querySelector('.divider');

    divider.addEventListener('mousedown', function(e) {
        const initialX = e.clientX;
        const initialWidth = sidebar.offsetWidth;

        function onMouseMove(e) {
            const deltaX = e.clientX - initialX;
            let newWidth = initialWidth + deltaX;
            const minWidth = 200;
            const maxWidth = 500;
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            sidebar.style.width = newWidth + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    checkSidebarVisibility();
    window.addEventListener('resize', checkSidebarVisibility);

    fetch('/search-index.json')
        .then(response => response.json())
        .then(data => {
            searchData = data;
        });

    document.getElementById('search-input').addEventListener('input', function(e) {
        const query = e.target.value;
        const options = {
            keys: ['url', 'content'],
            threshold: 0.3,
            includeMatches: true,
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

                const titleLink = document.createElement('h3');
                const link = document.createElement('a');
                link.href = `/${item.url}`;
                link.textContent = getName(item.url.replace('.html', ""));
                titleLink.appendChild(link);

                const contentPreview = document.createElement('div');
                contentPreview.classList.add('search-content-preview');

                if (result.matches) {
                    result.matches.forEach(match => {
                        if (match.key === 'content') {
                            const originalText = item.content;
                            const indices = match.indices;

                            let highlightedText = '';
                            let lastIndex = 0;

                            indices.forEach(([start, end]) => {
                                highlightedText += originalText.slice(Math.max(0, start - 50), start);

                                highlightedText += `<mark>${originalText.slice(start, end + 1)}</mark>`;

                                highlightedText += originalText.slice(end + 1, end + 50);
                            });

                            const previewElement = document.createElement('p');
                            previewElement.innerHTML = '...' + highlightedText + '...';
                            contentPreview.appendChild(previewElement);
                        }
                    });
                }

                resultElement.appendChild(titleLink);
                resultElement.appendChild(contentPreview);

                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }); */

    // Add CSS for search results
    //const searchStyle = document.createElement('style');
    //searchStyle.textContent = `
    //    .search-content-preview {
    //        font-size: 0.9em;
    //        color: #666;
    //        margin-top: 5px;
    //    }
    //    .search-content-preview mark {
    //        background-color: yellow;
    //        font-weight: bold;
    //        padding: 0 2px;
    //    }
    //    #search-results {
    //        max-height: 300px;
    //        overflow-y: auto;
    //        border: 1px solid #ddd;
    //        padding: 10px;
    //        margin-top: 10px;
    //    }
    //`;
    //document.head.appendChild(searchStyle);

});

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


//function initializeCopyButton() {
//    const codeBlocks = document.querySelectorAll('pre');
//    codeBlocks.forEach(block => {
//        const button = document.createElement('button');
//        button.textContent = 'Copy';
//        button.classList.add('copy-button');

//        button.addEventListener('click', () => {
//            const code = block.querySelector('code')?.textContent || block.textContent;
//            navigator.clipboard.writeText(code).then(() => {
//                button.textContent = 'Copied!';
//                setTimeout(() => {
//                    button.textContent = 'Copy';
//                }, 2000);
//            }).catch(err => {
//                console.error('Failed to copy:', err);
//                button.textContent = 'Error!';
//                setTimeout(() => {
//                    button.textContent = 'Copy';
//                }, 2000);
//            });
//        });

//        block.appendChild(button);
//    });
//}

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

function applyTheme(toggle = false) {
    let theme = localStorage.getItem('theme');

    if (!theme) {
        theme = 'dark';
        localStorage.setItem('theme', 'dark');
    }

    if (toggle) {
        theme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    }

    const body = document.body;

    if (theme === 'dark') {
        body.classList.remove('light');
        body.classList.add('dark');
    } else if (theme === 'light') {
        body.classList.remove('dark');
        body.classList.add('light');
    }
}

function toggleNav() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle("hidden");
}

function openSearch() {
    const bgDiv = document.querySelector('.bg');
    const searchBarDiv = document.querySelector('.search-bar');

    bgDiv.classList.remove('hidden');
    searchBarDiv.classList.remove('hidden');
}

document.addEventListener('click', function(event) {
    const bgDiv = document.querySelector('.bg');
    const searchBarDiv = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    if (!searchBarDiv.classList.contains('hidden') &&
        !searchButton.contains(event.target) &&
        !searchInput.contains(event.target)) {
        bgDiv.classList.add('hidden');
        searchBarDiv.classList.add('hidden');
    }
});
function checkSidebarVisibility() {
    if (sidebar) {
        if (window.innerWidth > 1200) {
            sidebar.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
        }
    }
}
