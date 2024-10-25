document.addEventListener('DOMContentLoaded', function() {
    const educationLevel = document.getElementById('educationLevel');
    const interests = document.getElementById('interests');
    const saveButton = document.getElementById('saveSettings');
    const adaptButton = document.getElementById('adaptPage');
    const statusMessage = document.getElementById('statusMessage');

    // Load saved settings
    loadSettings();

    saveButton.addEventListener('click', saveSettings);
    adaptButton.addEventListener('click', adaptPage);

    // Add input event listeners for real-time validation
    educationLevel.addEventListener('change', validateInputs);
    interests.addEventListener('input', validateInputs);

    function loadSettings() {
        chrome.storage.sync.get(['educationLevel', 'interests'], function(result) {
            educationLevel.value = result.educationLevel || 'high';
            interests.value = result.interests || '';
            validateInputs();
        });
    }

    function saveSettings() {
        if (!validateInputs()) return;

        chrome.storage.sync.set({
            educationLevel: educationLevel.value,
            interests: interests.value
        }, function() {
            showStatus('Settings saved!', 'success');
        });
    }

    function adaptPage() {
        if (!validateInputs()) return;

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'adaptContent'}, function(response) {
                    if (chrome.runtime.lastError) {
                        showStatus('Error: Could not adapt page. Please try again.', 'error');
                    } else {
                        showStatus('Page adapted successfully!', 'success');
                    }
                });
            } else {
                showStatus('Error: No active tab found.', 'error');
            }
        });
    }

    function validateInputs() {
        let isValid = true;

        if (!educationLevel.value) {
            showStatus('Please select an education level.', 'error');
            isValid = false;
        }

        if (!interests.value.trim()) {
            showStatus('Please enter at least one interest.', 'error');
            isValid = false;
        }

        if (isValid) {
            adaptButton.disabled = false;
            saveButton.disabled = false;
        } else {
            adaptButton.disabled = true;
            saveButton.disabled = true;
        }

        return isValid;
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.style.display = 'block';

        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
});
