// Demo page specific JavaScript

// Demo state
let demoState = {
    emf: {
        active: false,
        value: 0,
        interval: null,
        logEntries: []
    },
    evp: {
        recording: false,
        playing: false,
        startTime: null,
        canvas: null,
        ctx: null,
        analysisResults: []
    },
    spirit: {
        messages: [],
        responses: [
            "I am here...",
            "My name is Sarah...",
            "I died in 1847...",
            "I have been waiting...",
            "The children... they are safe now...",
            "I cannot rest...",
            "Help me find peace...",
            "The light... it calls to me...",
            "Remember my name...",
            "I loved this place once..."
        ]
    },
    session: {
        startTime: Date.now(),
        eventCount: 0,
        entries: []
    }
};

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    initEMFModule();
    initEVPModule();
    initSpiritModule();
    initSessionModule();
    startSessionTimer();
});

// EMF Module
function initEMFModule() {
    const startBtn = document.getElementById('emf-start');
    const stopBtn = document.getElementById('emf-stop');
    
    if (startBtn) {
        startBtn.addEventListener('click', startEMFDetection);
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', stopEMFDetection);
    }
}

function startEMFDetection() {
    demoState.emf.active = true;
    
    const startBtn = document.getElementById('emf-start');
    const stopBtn = document.getElementById('emf-stop');
    const statusIndicator = document.querySelector('.demo-module .status-indicator');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (statusIndicator) statusIndicator.classList.add('active');
    
    // Start EMF simulation
    demoState.emf.interval = setInterval(updateEMFReading, 500);
    
    // Log event
    logSessionEvent('EMF Detection Started', 'System');
}

function stopEMFDetection() {
    demoState.emf.active = false;
    
    const startBtn = document.getElementById('emf-start');
    const stopBtn = document.getElementById('emf-stop');
    const statusIndicator = document.querySelector('.demo-module .status-indicator');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (statusIndicator) statusIndicator.classList.remove('active');
    
    // Stop EMF simulation
    if (demoState.emf.interval) {
        clearInterval(demoState.emf.interval);
        demoState.emf.interval = null;
    }
    
    // Log event
    logSessionEvent('EMF Detection Stopped', 'System');
}

function updateEMFReading() {
    const valueElement = document.querySelector('.emf-value');
    const fillElement = document.querySelector('.emf-fill');
    const fieldElement = document.querySelector('.emf-field');
    
    // Generate realistic EMF fluctuations
    let newValue;
    if (Math.random() < 0.1) {
        // 10% chance of high activity spike
        newValue = Math.floor(Math.random() * 30) + 70; // 70-100%
    } else if (Math.random() < 0.3) {
        // 30% chance of medium activity
        newValue = Math.floor(Math.random() * 40) + 30; // 30-70%
    } else {
        // Normal low activity
        newValue = Math.floor(Math.random() * 30); // 0-30%
    }
    
    demoState.emf.value = newValue;
    
    if (valueElement) valueElement.textContent = newValue;
    if (fillElement) fillElement.style.width = newValue + '%';
    if (fieldElement) {
        const intensity = newValue / 100;
        fieldElement.style.filter = `drop-shadow(0 0 ${20 + intensity * 30}px #ff10f0) brightness(${1 + intensity})`;
    }
    
    // Log significant readings
    if (newValue > 60) {
        logEMFActivity(newValue, 'High Activity Detected');
        logSessionEvent(`EMF Spike: ${newValue}%`, 'EMF');
    } else if (newValue > 30) {
        logEMFActivity(newValue, 'Medium Activity');
    }
}

function logEMFActivity(value, description) {
    const logContainer = document.getElementById('emf-log-entries');
    if (!logContainer) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-description">${description}</span>
        <span class="log-value">${value}%</span>
        <span class="log-timestamp">${new Date().toLocaleTimeString()}</span>
    `;
    
    logContainer.insertBefore(entry, logContainer.firstChild);
    
    // Keep only last 5 entries
    while (logContainer.children.length > 5) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// EVP Module
function initEVPModule() {
    const recordBtn = document.getElementById('evp-record');
    const playBtn = document.getElementById('evp-play');
    const analyzeBtn = document.getElementById('evp-analyze');
    const canvas = document.getElementById('evp-canvas');
    
    if (recordBtn) recordBtn.addEventListener('click', toggleEVPRecording);
    if (playBtn) playBtn.addEventListener('click', playEVPRecording);
    if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeEVPRecording);
    
    if (canvas) {
        demoState.evp.canvas = canvas;
        demoState.evp.ctx = canvas.getContext('2d');
        drawEVPWaveform();
    }
}

function toggleEVPRecording() {
    const recordBtn = document.getElementById('evp-record');
    const playBtn = document.getElementById('evp-play');
    const analyzeBtn = document.getElementById('evp-analyze');
    
    if (!demoState.evp.recording) {
        // Start recording
        demoState.evp.recording = true;
        demoState.evp.startTime = Date.now();
        
        if (recordBtn) {
            recordBtn.textContent = '⏹️ Stop';
            recordBtn.classList.add('recording');
        }
        if (playBtn) playBtn.disabled = true;
        if (analyzeBtn) analyzeBtn.disabled = true;
        
        startEVPTimer();
        simulateEVPRecording();
        logSessionEvent('EVP Recording Started', 'EVP');
    } else {
        // Stop recording
        demoState.evp.recording = false;
        
        if (recordBtn) {
            recordBtn.textContent = '🎤 Record';
            recordBtn.classList.remove('recording');
        }
        if (playBtn) playBtn.disabled = false;
        if (analyzeBtn) analyzeBtn.disabled = false;
        
        stopEVPTimer();
        logSessionEvent('EVP Recording Stopped', 'EVP');
    }
}

function startEVPTimer() {
    const timerElement = document.getElementById('evp-time');
    
    const timer = setInterval(() => {
        if (!demoState.evp.recording) {
            clearInterval(timer);
            return;
        }
        
        const elapsed = Date.now() - demoState.evp.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function stopEVPTimer() {
    const timerElement = document.getElementById('evp-time');
    if (timerElement && demoState.evp.startTime) {
        const elapsed = Date.now() - demoState.evp.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function simulateEVPRecording() {
    const interval = setInterval(() => {
        if (!demoState.evp.recording) {
            clearInterval(interval);
            return;
        }
        
        drawEVPWaveform();
    }, 100);
}

function drawEVPWaveform() {
    const canvas = demoState.evp.canvas;
    const ctx = demoState.evp.ctx;
    
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw waveform
    ctx.strokeStyle = '#ff10f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const centerY = canvas.height / 2;
    let x = 0;
    
    for (let i = 0; i < canvas.width; i += 2) {
        const amplitude = demoState.evp.recording ? 
            (Math.random() - 0.5) * (Math.random() > 0.9 ? 40 : 10) : 
            (Math.random() - 0.5) * 5;
        
        const y = centerY + amplitude;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        x += 2;
    }
    
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = '#ff10f0';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function playEVPRecording() {
    const playBtn = document.getElementById('evp-play');
    
    if (!demoState.evp.playing) {
        demoState.evp.playing = true;
        if (playBtn) playBtn.textContent = '⏸️ Pause';
        
        // Simulate playback
        setTimeout(() => {
            demoState.evp.playing = false;
            if (playBtn) playBtn.textContent = '▶️ Play';
        }, 3000);
        
        logSessionEvent('EVP Playback Started', 'EVP');
    } else {
        demoState.evp.playing = false;
        if (playBtn) playBtn.textContent = '▶️ Play';
    }
}

function analyzeEVPRecording() {
    const analysisContainer = document.getElementById('evp-analysis');
    if (!analysisContainer) return;
    
    // Show loading state
    analysisContainer.innerHTML = '<div class="analysis-loading">Analyzing audio... Please wait...</div>';
    
    // Simulate analysis
    setTimeout(() => {
        const results = [
            { type: 'Voice Detected', confidence: '87%', description: 'Whispered voice at 2.3kHz frequency' },
            { type: 'Anomaly Found', confidence: '64%', description: 'Unexplained frequency spike at 4.1kHz' },
            { type: 'Background Noise', confidence: '23%', description: 'Standard environmental noise' }
        ];
        
        let html = '';
        results.forEach(result => {
            html += `
                <div class="analysis-result">
                    <strong>${result.type}</strong> (${result.confidence})<br>
                    <small>${result.description}</small>
                </div>
            `;
        });
        
        analysisContainer.innerHTML = html;
        logSessionEvent('EVP Analysis Completed', 'EVP');
    }, 2000);
}

// Spirit Communication Module
function initSpiritModule() {
    const sendBtn = document.getElementById('spirit-send');
    const inputField = document.getElementById('spirit-input');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    if (sendBtn) sendBtn.addEventListener('click', sendSpiritMessage);
    if (inputField) {
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendSpiritMessage();
            }
        });
    }
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const inputField = document.getElementById('spirit-input');
            if (inputField) {
                inputField.value = this.textContent;
                sendSpiritMessage();
            }
        });
    });
}

function sendSpiritMessage() {
    const inputField = document.getElementById('spirit-input');
    const messagesContainer = document.getElementById('spirit-messages');
    
    if (!inputField || !messagesContainer) return;
    
    const message = inputField.value.trim();
    if (!message) return;
    
    // Add user message
    addSpiritMessage(message, 'user');
    inputField.value = '';
    
    // Simulate spirit response after delay
    setTimeout(() => {
        const response = getRandomSpiritResponse();
        addSpiritMessage(response, 'spirit');
        logSessionEvent(`Spirit Communication: "${message}" -> "${response}"`, 'Spirit');
    }, 1000 + Math.random() * 2000);
}

function addSpiritMessage(message, sender) {
    const messagesContainer = document.getElementById('spirit-messages');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `spirit-message ${sender}`;
    messageElement.textContent = message;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add typing effect for spirit messages
    if (sender === 'spirit') {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transition = 'opacity 0.5s ease';
        }, 100);
    }
}

function getRandomSpiritResponse() {
    const responses = demoState.spirit.responses;
    return responses[Math.floor(Math.random() * responses.length)];
}

// Session Module
function initSessionModule() {
    const exportBtn = document.getElementById('export-data');
    const clearBtn = document.getElementById('clear-log');
    
    if (exportBtn) exportBtn.addEventListener('click', exportSessionData);
    if (clearBtn) clearBtn.addEventListener('click', clearSessionLog);
}

function startSessionTimer() {
    const timerElement = document.getElementById('session-timer');
    
    setInterval(() => {
        const elapsed = Date.now() - demoState.session.startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        if (timerElement) {
            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function logSessionEvent(description, type) {
    const entriesContainer = document.getElementById('session-entries');
    const eventCountElement = document.getElementById('event-count');
    
    demoState.session.eventCount++;
    
    const entry = {
        timestamp: new Date().toLocaleTimeString(),
        type: type,
        description: description
    };
    
    demoState.session.entries.push(entry);
    
    if (entriesContainer) {
        const entryElement = document.createElement('div');
        entryElement.className = 'session-entry';
        entryElement.innerHTML = `
            <span class="entry-description">${description}</span>
            <span class="entry-type">${type}</span>
            <span class="entry-timestamp">${entry.timestamp}</span>
        `;
        
        entriesContainer.insertBefore(entryElement, entriesContainer.firstChild);
        
        // Keep only last 10 entries visible
        while (entriesContainer.children.length > 10) {
            entriesContainer.removeChild(entriesContainer.lastChild);
        }
    }
    
    if (eventCountElement) {
        eventCountElement.textContent = demoState.session.eventCount;
    }
}

function exportSessionData() {
    const data = {
        sessionStart: new Date(demoState.session.startTime).toISOString(),
        sessionEnd: new Date().toISOString(),
        eventCount: demoState.session.eventCount,
        entries: demoState.session.entries,
        emfReadings: demoState.emf.logEntries,
        spiritMessages: demoState.spirit.messages
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hey-ghost-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logSessionEvent('Session Data Exported', 'System');
}

function clearSessionLog() {
    const entriesContainer = document.getElementById('session-entries');
    const eventCountElement = document.getElementById('event-count');
    
    if (entriesContainer) {
        entriesContainer.innerHTML = '';
    }
    
    if (eventCountElement) {
        eventCountElement.textContent = '0';
    }
    
    demoState.session.eventCount = 0;
    demoState.session.entries = [];
    
    logSessionEvent('Session Log Cleared', 'System');
}

// Initialize demo effects
document.addEventListener('DOMContentLoaded', function() {
    // Add some initial activity
    setTimeout(() => {
        logSessionEvent('Demo Initialized', 'System');
        logSessionEvent('All Modules Ready', 'System');
    }, 1000);
    
    // Add random EMF fluctuations even when not active
    setInterval(() => {
        if (!demoState.emf.active && Math.random() < 0.1) {
            const fieldElement = document.querySelector('.emf-field');
            if (fieldElement) {
                fieldElement.style.filter = 'drop-shadow(0 0 25px #ff10f0) brightness(1.2)';
                setTimeout(() => {
                    fieldElement.style.filter = 'drop-shadow(0 0 20px #ff10f0)';
                }, 200);
            }
        }
    }, 3000);
    
    // Update EVP waveform even when not recording
    setInterval(() => {
        if (!demoState.evp.recording) {
            drawEVPWaveform();
        }
    }, 2000);
});
