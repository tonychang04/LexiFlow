chrome.runtime.onInstalled.addListener(function() {
    console.log('LexiFlow extension installed');
});

async function callGPT4API(content, educationLevel, interests) {
    const apiKey = await new Promise(resolve => {
        chrome.storage.sync.get(['apiKey'], result => resolve(result.apiKey));
    });

    if (!apiKey) {
        throw new Error('API key not found. Please set your OpenAI API key in the extension options.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that adapts text content to a ${educationLevel} education level. 
                              Focus on the following interests: ${interests}.`
                },
                {
                    role: "user",
                    content: `Please adapt the following text: ${content}`
                }
            ],
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'processContent') {
        callGPT4API(request.content, request.educationLevel, request.interests)
            .then(adaptedContent => {
                sendResponse({adaptedContent: adaptedContent});
            })
            .catch(error => {
                sendResponse({error: error.message});
            });
        return true; // Indicates async response
    }
});
