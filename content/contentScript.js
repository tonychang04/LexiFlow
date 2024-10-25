console.log('Content script loaded');

let isAdapting = false;

function getTextNodes(node) {
    const textNodes = [];
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while (n = walk.nextNode()) textNodes.push(n);
    return textNodes;
}

function adaptContent() {
    if (isAdapting) return;
    isAdapting = true;

    chrome.storage.sync.get(['educationLevel', 'interests'], function(result) {
        const educationLevel = result.educationLevel || 'high';
        const interests = result.interests || '';
        const textNodes = getTextNodes(document.body);
        
        let processedNodes = 0;
        
        textNodes.forEach((node) => {
            if (node.textContent.trim().length > 50) {
                chrome.runtime.sendMessage({
                    action: 'processContent',
                    content: node.textContent,
                    educationLevel: educationLevel,
                    interests: interests
                }, function(response) {
                    if (response && response.adaptedContent) {
                        node.textContent = response.adaptedContent;
                    } else if (response && response.error) {
                        console.error('Error adapting content:', response.error);
                    }
                    processedNodes++;
                    if (processedNodes === textNodes.length) {
                        isAdapting = false;
                    }
                });
            } else {
                processedNodes++;
                if (processedNodes === textNodes.length) {
                    isAdapting = false;
                }
            }
        });
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'adaptContent') {
        adaptContent();
        sendResponse({success: true});
    }
});
