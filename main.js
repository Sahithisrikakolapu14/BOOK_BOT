let documentProcessed = false;
let questionHistory = [];
let currentDocument = null;

const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const uploadStatus = document.getElementById('uploadStatus');
const questionInput = document.getElementById('questionInput');
const askBtn = document.getElementById('askBtn');
const loading = document.getElementById('loading');
const answerSection = document.getElementById('answerSection');
const answerText = document.getElementById('answerText');
const historyDiv = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyCount = document.getElementById('historyCount');

fileInput.addEventListener('change', handleFileUpload);
askBtn.addEventListener('click', askQuestion);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !askBtn.disabled) {
        askQuestion();
    }
});
clearHistoryBtn.addEventListener('click', clearHistory);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    fileInfo.style.display = 'block';
    fileInfo.innerHTML = `
        <strong>📄 File:</strong> ${file.name}<br>
        <strong>📊 Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
        <strong>🔗 Type:</strong> ${file.type || 'Unknown'}
    `;

    showStatus('📤 Processing document...', 'info');
    
    setTimeout(() => {
        processDocument(file);
    }, 1500);
}

function processDocument(file) {
    currentDocument = {
        name: file.name,
        content: "Sample document content for demonstration purposes",
        type: file.type,
        size: file.size
    };

    documentProcessed = true;
    questionInput.disabled = false;
    askBtn.disabled = false;
    
    showStatus('✅ Document processed successfully! You can now ask questions.', 'success');
    
    updateQuestionPlaceholder();
}

function showStatus(message, type) {
    uploadStatus.style.display = 'block';
    uploadStatus.className = `status ${type}`;
    uploadStatus.innerHTML = message;
    
    if (type === 'info') {
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 5000);
    }
}

async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question || !documentProcessed) return;

    loading.style.display = 'block';
    answerSection.style.display = 'none';
    askBtn.disabled = true;
    questionInput.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

        const answer = generateSampleAnswer(question);
        
        showAnswer(answer);
        
        addToHistory(question, answer);
        
        questionInput.value = '';
        updateQuestionPlaceholder();
        
    } catch (error) {
        console.error('Error processing question:', error);
        showAnswer('Sorry, there was an error processing your question. Please try again.');
    } finally {
        loading.style.display = 'none';
        askBtn.disabled = false;
        questionInput.disabled = false;
        questionInput.focus();
    }
}

function showAnswer(answer) {
    answerText.textContent = answer;
    answerSection.style.display = 'block';
    
    answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateSampleAnswer(question) {
    const q = question.toLowerCase();
    
    if (q.includes('main character') || q.includes('protagonist')) {
        return `The main character appears to be Elizabeth Bennet, who serves as the protagonist throughout the narrative. She is characterized by her intelligence, wit, and strong moral convictions.`;
    } else if (q.includes('setting') || q.includes('place') || q.includes('where')) {
        return `The story is set in rural England during the early 19th century, specifically in the fictional town of Meryton in Hertfordshire. The setting plays a crucial role in establishing the social context of the period.`;
    } else if (q.includes('theme') || q.includes('marriage')) {
        return `The central themes include marriage and social class, the importance of first impressions vs. deeper understanding, and personal growth through self-reflection. The title "Pride and Prejudice" itself reflects these key themes.`;
    } else if (q.includes('author') || q.includes('writer') || q.includes('who wrote')) {
        return `This novel was written by Jane Austen, published in 1813. It's considered one of the greatest works of English literature and helped establish the modern romance novel genre.`;
    } else if (q.includes('plot') || q.includes('story') || q.includes('summary')) {
        return `The plot follows Elizabeth Bennet as she navigates issues of marriage, morality, and social expectations in 19th century England. Her relationship with the proud Mr. Darcy forms the central romantic storyline.`;
    } else if (q.includes('character') && (q.includes('darcy') || q.includes('mr'))) {
        return `Mr. Darcy is initially portrayed as proud and arrogant, but is revealed to be honorable and generous. His character development and relationship with Elizabeth drives much of the novel's plot.`;
    } else {
        return `Based on my analysis of the document, regarding "${question}": The text contains several relevant passages that address your query. The information suggests that this topic is explored through character interactions and narrative development. This represents the key insights I can extract from the document content.`;
    }
}

function addToHistory(question, answer) {
    const historyItem = {
        question,
        answer,
        timestamp: new Date(),
        id: Date.now()
    };
    
    questionHistory.unshift(historyItem);
    
    if (questionHistory.length > 20) {
        questionHistory = questionHistory.slice(0, 20);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const count = questionHistory.length;
    historyCount.textContent = `${count} question${count === 1 ? '' : 's'}`;
    
    clearHistoryBtn.style.display = count > 0 ? 'block' : 'none';
    
    if (count === 0) {
        historyDiv.innerHTML = `
            <div class="empty-history">
                <div class="empty-icon">💭</div>
                <p>No questions asked yet...</p>
                <p style="font-size: 0.8em; color: #999; margin-top: 5px;">Upload a document and ask questions to see history here</p>
            </div>
        `;
        return;
    }

    historyDiv.innerHTML = questionHistory.map((item, index) => {
        const timeAgo = getTimeAgo(item.timestamp);
        const isRecent = index === 0;
        
        return `
            <div class="history-item ${isRecent ? 'recent' : ''}">
                <div class="history-item-header">
                    <div class="history-question">❓ ${item.question}</div>
                    <div class="history-timestamp">${timeAgo}</div>
                </div>
                <div class="history-answer">💬 ${item.answer}</div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all question history?')) {
        questionHistory = [];
        updateHistoryDisplay();
    }
}

const sampleQuestions = [
    "Who is the main character?",
    "What is the setting of the story?",
    "What are the main themes?",
    "Who wrote this book?",
    "What is the plot summary?",
    "Tell me about Mr. Darcy",
    "What is the significance of marriage in the novel?"
];

function updateQuestionPlaceholder() {
    if (documentProcessed) {
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        questionInput.placeholder = `Try asking: "${randomQuestion}"`;
    }
}

questionInput.addEventListener('focus', updateQuestionPlaceholder);
questionInput.addEventListener('blur', () => {
    if (documentProcessed) {
        questionInput.placeholder = "Ask a question about your document...";
    }
});

console.log('Document Q&A System initialized');