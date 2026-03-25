const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
});

const elements = {
    uploader: document.getElementById('uploader'),
    videoPreview: document.getElementById('video-preview'),
    editorContainer: document.getElementById('editor-container'),
    status: document.getElementById('status'),
    exportBtn: document.getElementById('export-btn'),
    progressContainer: document.getElementById('progress-container'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    progressPercent: document.getElementById('progress-percent'),
    downloadContainer: document.getElementById('download-container'),
    downloadLink: document.getElementById('download-link'),
    startTime: document.getElementById('start-time'),
    endTime: document.getElementById('end-time'),
    rangeStart: document.getElementById('range-start'),
    rangeEnd: document.getElementById('range-end'),
    timelineRange: document.getElementById('timeline-range'),
    setStartBtn: document.getElementById('set-start-btn'),
    setEndBtn: document.getElementById('set-end-btn'),
    currentTimeVal: document.getElementById('current-time-val'),
    currentFrameVal: document.getElementById('current-frame-val'),
    captureFrameBtn: document.getElementById('capture-frame-btn'),
    dropZone: document.getElementById('drop-zone')
};

let videoFile = null;
let isFFmpegLoaded = false;
let videoFPS = 30;

async function initFFmpeg() {
    const lang = getCurrentLang();
    try {
        elements.status.innerText = translations[lang].status_init;
        await ffmpeg.load();
        isFFmpegLoaded = true;
        elements.status.innerText = translations[lang].status_ready;
    } catch (error) {
        elements.status.innerText = translations[lang].status_error + error.message;
    }
}

initFFmpeg();

elements.videoPreview.ontimeupdate = () => {
    const time = elements.videoPreview.currentTime;
    elements.currentTimeVal.innerText = time.toFixed(2) + 's';
    elements.currentFrameVal.innerText = `(Frame: ${Math.floor(time * videoFPS)})`;
};

ffmpeg.setLogger(({ message }) => {
    const fpsMatch = message.match(/(\d+(?:\.\d+)?)\s+fps/);
    if (fpsMatch) videoFPS = parseFloat(fpsMatch[1]);
});

async function handleFile(file) {
    if (!file) return;
    videoFile = file;
    const url = URL.createObjectURL(file);
    elements.videoPreview.src = url;
    elements.editorContainer.classList.remove('hidden');
    elements.dropZone.classList.add('hidden');
    
    elements.videoPreview.onloadedmetadata = () => {
        const duration = elements.videoPreview.duration;
        elements.startTime.value = "0.00";
        elements.endTime.value = duration.toFixed(2);
        elements.rangeStart.max = duration;
        elements.rangeEnd.max = duration;
        elements.rangeStart.value = 0;
        elements.rangeEnd.value = duration;
        updateTimelineVisual();
    };

    ffmpeg.FS('writeFile', 'tmp.mp4', await fetchFile(file));
    await ffmpeg.run('-i', 'tmp.mp4');
}

function updateTimelineVisual() {
    const start = parseFloat(elements.rangeStart.value);
    const end = parseFloat(elements.rangeEnd.value);
    const duration = elements.videoPreview.duration;
    if (start > end) elements.rangeStart.value = end;
    elements.startTime.value = parseFloat(elements.rangeStart.value).toFixed(2);
    elements.endTime.value = parseFloat(elements.rangeEnd.value).toFixed(2);
    const left = (elements.rangeStart.value / duration) * 100;
    const right = 100 - (elements.rangeEnd.value / duration) * 100;
    elements.timelineRange.style.left = left + '%';
    elements.timelineRange.style.right = right + '%';
}

elements.rangeStart.oninput = () => {
    if (parseFloat(elements.rangeStart.value) > parseFloat(elements.rangeEnd.value)) {
        elements.rangeStart.value = elements.rangeEnd.value;
    }
    elements.videoPreview.currentTime = elements.rangeStart.value;
    updateTimelineVisual();
};

elements.rangeEnd.oninput = () => {
    if (parseFloat(elements.rangeEnd.value) < parseFloat(elements.rangeStart.value)) {
        elements.rangeEnd.value = elements.rangeStart.value;
    }
    elements.videoPreview.currentTime = elements.rangeEnd.value;
    updateTimelineVisual();
};

elements.setStartBtn.onclick = () => {
    elements.rangeStart.value = elements.videoPreview.currentTime;
    updateTimelineVisual();
};

elements.setEndBtn.onclick = () => {
    elements.rangeEnd.value = elements.videoPreview.currentTime;
    updateTimelineVisual();
};

window.onkeydown = (e) => {
    if (!videoFile || document.activeElement.tagName === 'INPUT') return;
    let step = e.shiftKey ? 0.01 : 0.05;
    if (e.key === 'ArrowLeft') {
        elements.videoPreview.currentTime = Math.max(0, elements.videoPreview.currentTime - step);
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        elements.videoPreview.currentTime = Math.min(elements.videoPreview.duration, elements.videoPreview.currentTime + step);
        e.preventDefault();
    } else if (e.key === ' ') {
        elements.videoPreview.paused ? elements.videoPreview.play() : elements.videoPreview.pause();
        e.preventDefault();
    }
};

elements.dropZone.onclick = () => elements.uploader.click();
elements.uploader.onchange = (e) => handleFile(e.target.files[0]);

elements.dropZone.ondragover = (e) => { e.preventDefault(); elements.dropZone.classList.add('dragover'); };
elements.dropZone.ondragleave = () => elements.dropZone.classList.remove('dragover');
elements.dropZone.ondrop = (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
};

elements.captureFrameBtn.onclick = () => {
    if (!elements.videoPreview.src) return;
    const canvas = document.createElement('canvas');
    canvas.width = elements.videoPreview.videoWidth;
    canvas.height = elements.videoPreview.videoHeight;
    canvas.getContext('2d').drawImage(elements.videoPreview, 0, 0);
    const link = document.createElement('a');
    link.download = `output_frame_${elements.videoPreview.currentTime.toFixed(2)}s.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
};

elements.exportBtn.onclick = async () => {
    if (!videoFile || !isFFmpegLoaded) return;
    elements.exportBtn.disabled = true;
    elements.progressContainer.classList.remove('hidden');
    elements.downloadContainer.classList.add('hidden');

    const start = elements.startTime.value;
    const end = elements.endTime.value;
    const lang = getCurrentLang();

    ffmpeg.setProgress(({ ratio }) => {
        const p = Math.round(ratio * 100);
        elements.progressFill.style.width = `${p}%`;
        elements.progressPercent.innerText = `${p}%`;
    });

    try {
        elements.downloadLink.download = `output_trim.mp4`;
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
        await ffmpeg.run('-ss', start, '-to', end, '-i', 'input.mp4', '-c:v', 'copy', '-c:a', 'copy', 'output.mp4');
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        elements.downloadLink.href = url;
        elements.downloadContainer.classList.remove('hidden');
        elements.progressText.innerText = translations[lang].encoding_done;
    } catch (err) {
        elements.progressText.innerText = translations[lang].status_error + err.message;
    } finally {
        elements.exportBtn.disabled = false;
    }
};
