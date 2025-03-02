
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.nextElementSibling;
            const codeElement = codeBlock.querySelector('code');
            
            if (codeElement) {
                const textToCopy = codeElement.innerText;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    button.textContent = 'Copied!';
                    button.dataset.copyState = 'copied';
                    
                    setTimeout(() => {
                        button.textContent = 'Copy';
                        button.dataset.copyState = 'copy';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    button.textContent = 'Failed!';
                    
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 1000);
                });
            }
        });
    });
});