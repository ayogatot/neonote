document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-all');
    const notesList = document.getElementById('notes-list');
    const notesCount = document.getElementById('notes-count');

    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const url = currentTab.url;

        // Check for notes on this URL
        chrome.storage.local.get([url], (result) => {
            const notes = result[url] || [];
            if (notes.length > 0) {
                notesCount.innerText = `Found ${notes.length} note(s) on this page.`;
                notesList.innerHTML = ''; // Clear loading/empty text
                notes.forEach((note, index) => {
                    const card = document.createElement('div');
                    card.className = 'note-card';

                    const previewText = note.content ? note.content : 'Empty Note';

                    card.innerHTML = `
                        <div class="note-preview">${previewText}</div>
                        <div class="note-meta">Note #${index + 1}</div>
                    `;

                    card.addEventListener('click', () => {
                        chrome.tabs.sendMessage(currentTab.id, {
                            action: 'scroll_to_note',
                            noteId: note.id
                        });
                    });

                    notesList.appendChild(card);
                });
            } else {
                notesCount.innerText = `No notes found on this page.`;
                notesList.innerHTML = '';
                clearBtn.disabled = true;
            }
        });

        // Clear handler
        clearBtn.addEventListener('click', () => {
            chrome.tabs.sendMessage(currentTab.id, { action: 'clear_notes' }, (response) => {
                if (response && response.status === 'success') {
                    notesCount.innerText = `No notes found on this page.`;
                    notesList.innerHTML = '';
                    clearBtn.disabled = true;
                }
            });
        });
    });
});
