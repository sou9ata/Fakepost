// ===== ELEMENTS =====
const pfpInput       = document.getElementById('pfp-input');
const pfpPreview     = document.getElementById('pfp-preview');
const postPfp        = document.getElementById('post-pfp');

const inputName      = document.getElementById('input-name');
const postName       = document.getElementById('post-name');

const toggleVerified = document.getElementById('toggle-verified');
const verifiedBadge  = document.getElementById('verified-badge');

const inputDatetime  = document.getElementById('input-datetime');
const postTime       = document.getElementById('post-time');

const inputVisibility = document.getElementById('input-visibility');
const visibilityIcon  = document.getElementById('visibility-icon');

const inputReactions = document.getElementById('input-reactions');
const reactionCount  = document.getElementById('reaction-count');

const inputComments  = document.getElementById('input-comments');
const postComments   = document.getElementById('post-comments');

const inputShares    = document.getElementById('input-shares');
const postShares     = document.getElementById('post-shares');

const downloadBtn    = document.getElementById('download-btn');
const fbPost         = document.getElementById('fb-post');

const reactionBubbles    = document.getElementById('reaction-bubbles');
const selectedEmojisLabel = document.getElementById('selected-emojis-label');
const emojiPicker        = document.getElementById('emoji-picker');

// ===== EMOJI STATE =====
let selectedEmojis = ['👍', '❤️', '😂'];

const VISIBILITY_MAP = {
  globe: '🌐',
  friends: '👥',
  lock: '🔒'
};

// ===== PROFILE PICTURE =====
pfpInput.addEventListener('change', () => {
  const file = pfpInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  pfpPreview.src = url;
  postPfp.src = url;
});

// ===== NAME =====
inputName.addEventListener('input', () => {
  postName.textContent = inputName.value || 'Page Name';
});

// ===== VERIFIED BADGE =====
toggleVerified.addEventListener('change', () => {
  verifiedBadge.classList.toggle('hidden', !toggleVerified.checked);
});

// ===== DATETIME =====
inputDatetime.addEventListener('input', () => {
  postTime.textContent = inputDatetime.value || 'Today at 7:00 PM';
});

// ===== VISIBILITY =====
inputVisibility.addEventListener('change', () => {
  visibilityIcon.textContent = VISIBILITY_MAP[inputVisibility.value] || '🌐';
});

// ===== REACTIONS =====
inputReactions.addEventListener('input', () => {
  reactionCount.textContent = inputReactions.value || '0';
});

// ===== COMMENTS =====
inputComments.addEventListener('input', () => {
  postComments.textContent = (inputComments.value || '0') + ' comments';
});

// ===== SHARES =====
inputShares.addEventListener('input', () => {
  postShares.textContent = (inputShares.value || '0') + ' shares';
});

// ===== EMOJI PICKER =====
function updateEmojiDisplay() {
  // Update label
  selectedEmojisLabel.textContent = selectedEmojis.join(' ') || 'None';
  // Update bubbles
  reactionBubbles.innerHTML = '';
  selectedEmojis.forEach(em => {
    const span = document.createElement('span');
    span.className = 'rbubble';
    span.textContent = em;
    reactionBubbles.appendChild(span);
  });
}

emojiPicker.addEventListener('click', (e) => {
  const ep = e.target.closest('.ep');
  if (!ep) return;
  const emoji = ep.dataset.emoji;

  if (selectedEmojis.includes(emoji)) {
    // Deselect
    selectedEmojis = selectedEmojis.filter(e => e !== emoji);
    ep.classList.remove('selected');
  } else {
    if (selectedEmojis.length >= 3) {
      // Remove first, add new
      const removed = selectedEmojis.shift();
      // Deselect removed emoji in picker
      const oldEl = emojiPicker.querySelector(`.ep[data-emoji="${removed}"]`);
      if (oldEl) oldEl.classList.remove('selected');
    }
    selectedEmojis.push(emoji);
    ep.classList.add('selected');
  }

  updateEmojiDisplay();
});

// Mark initially selected emojis
document.querySelectorAll('.ep').forEach(ep => {
  if (selectedEmojis.includes(ep.dataset.emoji)) {
    ep.classList.add('selected');
  }
});

// ===== DOWNLOAD =====
downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true;
  downloadBtn.textContent = '⏳ Generating...';

  // Load html2canvas from CDN
  if (!window.html2canvas) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  }

  try {
    const isTransparent = fbPostEl.classList.contains('mode-transparent');
    const canvas = await html2canvas(fbPost, {
      backgroundColor: isTransparent ? null : '#242526',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const link = document.createElement('a');
    link.download = 'fb-post.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    alert('Download failed. Try again.');
    console.error(err);
  }

  downloadBtn.disabled = false;
  downloadBtn.textContent = '⬇️ Download Post Image';
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ===== BACKGROUND COLOR SWITCHER =====
const postContentArea = document.querySelector('.post-content-area');
const fbPostEl = document.getElementById('fb-post');
const bgBtns = document.querySelectorAll('.bg-btn');
const BG_CLASSES = ['bg-black', 'bg-dim', 'bg-light', 'bg-transparent'];

bgBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const chosen = btn.dataset.bg;

    // Remove all bg classes from content area
    postContentArea.classList.remove(...BG_CLASSES);

    if (chosen === 'bg-transparent') {
      // True transparent: remove card bg, content area transparent
      postContentArea.classList.add('bg-transparent');
      fbPostEl.classList.add('mode-transparent');
    } else {
      // Solid color: restore card bg, apply content area color
      postContentArea.classList.add(chosen);
      fbPostEl.classList.remove('mode-transparent');
    }

    // Update active button
    bgBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Set default
postContentArea.classList.add('bg-dim');
