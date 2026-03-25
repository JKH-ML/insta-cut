const translations = {
    ko: {
        title: "비디오 에디터",
        meta_title: "온라인 MP4 비디오 에디터 | 빠르고 안전한 브라우저 기반 편집기",
        meta_description: "브라우저에서 직접 MP4 비디오를 자르고 크롭하세요. 서버 업로드 없이 100% 프라이버시가 보장되는 FFmpeg 기반 편집기입니다.",
        trim: "트림",
        crop: "크롭",
        status_init: "FFmpeg 엔진 로딩 중...",
        status_ready: "준비 완료: 파일을 선택하세요.",
        status_error: "엔진 로드 실패: ",
        upload_label: "클릭하거나 비디오를 드래그하세요",
        upload_label_crop: "크롭할 비디오를 클릭하거나 드래그하세요",
        trim_card_title: "트림",
        start_label: "시작 (초)",
        end_label: "종료 (초)",
        set_start: "시작 설정",
        set_end: "종료 설정",
        actions_title: "작업",
        capture_btn: "프레임 추출 (PNG)",
        export_trim_btn: "비디오 내보내기",
        progress_processing: "처리 중...",
        encoding_done: "인코딩 완료!",
        download_btn: "결과 다운로드",
        crop_settings_title: "크롭 설정",
        x_offset: "X 오프셋",
        y_offset: "Y 오프셋",
        width_label: "너비",
        height_label: "높이",
        reset_btn: "전체 화면으로 초기화",
        export_crop_btn: "크롭된 비디오 내보내기"
    },
    en: {
        title: "Video Editor",
        meta_title: "Online MP4 Video Editor | Fast & Private Browser-based Tool",
        meta_description: "Trim and crop MP4 videos directly in your browser. No uploads required, 100% private and fast using FFmpeg.wasm.",
        trim: "Trim",
        crop: "Crop",
        status_init: "FFmpeg initializing...",
        status_ready: "Ready: Select a file.",
        status_error: "Engine load failed: ",
        upload_label: "Click or drag to upload video",
        upload_label_crop: "Click or drag to upload video for cropping",
        trim_card_title: "Trim",
        start_label: "Start (s)",
        end_label: "End (s)",
        set_start: "Set Start",
        set_end: "Set End",
        actions_title: "Actions",
        capture_btn: "Capture Frame (PNG)",
        export_trim_btn: "Export Video",
        progress_processing: "Processing...",
        encoding_done: "Encoding complete!",
        download_btn: "Download Result",
        crop_settings_title: "Crop Settings",
        x_offset: "X Offset",
        y_offset: "Y Offset",
        width_label: "Width",
        height_label: "Height",
        reset_btn: "Reset to Full",
        export_crop_btn: "Export Cropped Video"
    },
    zh: {
        title: "视频编辑器",
        meta_title: "在线 MP4 视频编辑器 | 快速、私密的浏览器端工具",
        meta_description: "在浏览器中直接裁剪和切边 MP4 视频。无需上传，基于 FFmpeg.wasm 的 100% 私密快捷工具。",
        trim: "裁剪",
        crop: "切边",
        status_init: "FFmpeg 引擎加载中...",
        status_ready: "准备就绪：请选择文件。",
        status_error: "引擎加载失败：",
        upload_label: "点击或拖拽上传视频",
        upload_label_crop: "点击或拖拽上传视频进行切边",
        trim_card_title: "裁剪",
        start_label: "开始 (秒)",
        end_label: "结束 (秒)",
        set_start: "设置起点",
        set_end: "设置终点",
        actions_title: "操作",
        capture_btn: "截取帧 (PNG)",
        export_trim_btn: "导出视频",
        progress_processing: "处理中...",
        encoding_done: "编码完成！",
        download_btn: "下载结果",
        crop_settings_title: "切边设置",
        x_offset: "X 偏移",
        y_offset: "Y 偏移",
        width_label: "宽度",
        height_label: "高度",
        reset_btn: "重置为全屏",
        export_crop_btn: "导出切边视频"
    },
    ja: {
        title: "ビデオエディター",
        meta_title: "オンライン MP4 ビデオエディター | 高速・安全なブラウザベースの編集ツール",
        meta_description: "ブラウザ上で直接 MP4 ビデオをトリミング・クロップ。アップロード不要で 100% プライバシーが保護される FFmpeg ベースの編集器。",
        trim: "トリミング",
        crop: "クロップ",
        status_init: "FFmpegエンジンを読み込み中...",
        status_ready: "準備完了：ファイルを選択してください。",
        status_error: "エンジンの読み込みに失敗しました：",
        upload_label: "クリックまたはドラッグしてビデオをアップロード",
        upload_label_crop: "クリックまたはドラッグしてクロップするビデオをアップロード",
        trim_card_title: "トリミング",
        start_label: "開始 (秒)",
        end_label: "終了 (秒)",
        set_start: "開始を設定",
        set_end: "終了を設定",
        actions_title: "操作",
        capture_btn: "フレームをキャプチャ (PNG)",
        export_trim_btn: "ビデオを書き出し",
        progress_processing: "処理中...",
        encoding_done: "エンコード完了！",
        download_btn: "結果をダウンロード",
        crop_settings_title: "クロップ設定",
        x_offset: "X オフセット",
        y_offset: "Y オフセット",
        width_label: "幅",
        height_label: "高さ",
        reset_btn: "フルサイズにリセット",
        export_crop_btn: "クロップしたビデオを書き出し"
    }
};

function setLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);
    applyTranslations(lang);
}

function applyTranslations(lang) {
    const t = translations[lang];
    
    // Update Title and Meta tags for SEO
    document.title = t.meta_title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.meta_description);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerText = t[key];
        }
    });
    
    const selector = document.getElementById('lang-selector');
    if (selector) selector.value = lang;
}

function getCurrentLang() {
    return localStorage.getItem('preferred_lang') || 'ko';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = getCurrentLang();
    applyTranslations(savedLang);
    
    const selector = document.getElementById('lang-selector');
    if (selector) {
        selector.value = savedLang;
        selector.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            window.dispatchEvent(new CustomEvent('langChanged', { detail: e.target.value }));
        });
    }
});
