// State
let notes = [];

// Utils
function generateId() {
    return 'note_' + Math.random().toString(36).substr(2, 9);
}

// Create Note Element
function createNoteElement(x, y, content = '', id = null, color = 'cs-color-yellow') {
    const noteId = id || generateId();

    const note = document.createElement('div');
    note.classList.add('cs-sticky-note', color);
    note.id = noteId;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;

    const header = document.createElement('div');
    header.classList.add('cs-sticky-header');

    const minimizeBtn = document.createElement('button');
    minimizeBtn.classList.add('cs-sticky-btn');
    minimizeBtn.innerText = '_';
    minimizeBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent drag start
        toggleMinimize(note);
    };

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('cs-sticky-btn');
    closeBtn.innerText = 'X';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        deleteNote(note);
    };

    header.appendChild(minimizeBtn);
    header.appendChild(closeBtn);

    const textArea = document.createElement('textarea');
    textArea.classList.add('cs-sticky-content');
    textArea.placeholder = "Type a note...";
    textArea.value = content;

    // Auto-save on input
    textArea.addEventListener('input', () => {
        saveNotes();
    });

    note.appendChild(header);
    note.appendChild(textArea);

    // Drag Logic
    makeDraggable(note, header);

    document.body.appendChild(note);

    // Focus if new
    if (!content) {
        textArea.focus();
    }

    return {
        id: noteId,
        element: note,
        x, y, content, color
    };
}

// Drag Logic
function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handle.addEventListener('mousedown', (e) => {
        // Only left click
        if (e.button !== 0) return;

        e.preventDefault(); // Prevent text selection
        isDragging = true;

        // Get mouse position relative to viewport
        startX = e.clientX;
        startY = e.clientY;

        // Get current element position
        initialLeft = element.offsetLeft;
        initialTop = element.offsetTop;

        handle.style.cursor = 'grabbing';

        // Add listeners to document to handle drag outside the element
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        handle.style.cursor = 'grab';

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        saveNotes(); // Save position after drag
    }
}

function toggleMinimize(noteElement) {
    noteElement.classList.toggle('minimized');
    // If minimized, clicking it should restore it (handled by a click listener on the note itself if we want)
    if (noteElement.classList.contains('minimized')) {
        noteElement.onclick = () => {
            if (noteElement.classList.contains('minimized')) {
                noteElement.classList.remove('minimized');
                noteElement.onclick = null; // Remove this listener
            }
        };
    }
}

function deleteNote(noteElement) {
    noteElement.remove();
    saveNotes();
}

// Storage Logic
function saveNotes() {
    const noteElements = document.querySelectorAll('.cs-sticky-note');
    const notesData = Array.from(noteElements).map(el => {
        return {
            id: el.id,
            x: parseInt(el.style.left),
            y: parseInt(el.style.top),
            content: el.querySelector('.cs-sticky-content').value,
            color: 'cs-color-yellow', // TODO: Get actual color
            minimized: el.classList.contains('minimized')
        };
    });

    const url = window.location.href;
    chrome.storage.local.set({ [url]: notesData }, () => {
        console.log('Notes saved for', url);
    });
}

function loadNotes() {
    const url = window.location.href;
    chrome.storage.local.get([url], (result) => {
        const savedNotes = result[url];
        if (savedNotes) {
            savedNotes.forEach(noteData => {
                const noteObj = createNoteElement(noteData.x, noteData.y, noteData.content, noteData.id, noteData.color);
                if (noteData.minimized) {
                    toggleMinimize(noteObj.element);
                }
            });
        }
    });
}

// Event Listeners
document.addEventListener('dblclick', (e) => {
    // Prevent spawning if clicking on an existing note
    if (e.target.closest('.cs-sticky-note')) return;

    createNoteElement(e.pageX, e.pageY);
    saveNotes();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'clear_notes') {
        const notes = document.querySelectorAll('.cs-sticky-note');
        notes.forEach(note => note.remove());
        saveNotes(); // This will save an empty array
        sendResponse({ status: 'success' });
    } else if (request.action === 'scroll_to_note') {
        const note = document.getElementById(request.noteId);
        if (note) {
            note.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect
            const originalTransform = note.style.transform;
            note.style.transform = 'scale(1.1)';
            note.style.zIndex = '2147483647'; // Ensure it's on top
            setTimeout(() => {
                note.style.transform = originalTransform;
            }, 500);
        }
    } else if (request.action === 'url_changed') {
        // Clear existing notes
        const notes = document.querySelectorAll('.cs-sticky-note');
        notes.forEach(note => note.remove());
        // Load notes for new URL
        loadNotes();
    }
});

// Init
loadNotes();
