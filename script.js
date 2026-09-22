// ============================================
//   MALOBA OS — script.js
// ============================================

// ===== NAV HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mainNav.classList.toggle('open');
});

function closeNav() {
  hamburger.classList.remove('open');
  mainNav.classList.remove('open');
}

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
    closeNav();
  }
});

// ===== JAVIS CHAT =====
const chatBtn   = document.getElementById('chatBtn');
const closeChat = document.getElementById('closeChat');
const chatBox   = document.getElementById('javisBox');
const chatInput = document.getElementById('javisInput');
const chatArea  = document.getElementById('javisChat');
const micBtn    = document.getElementById('micBtn');
const clearBtn  = document.getElementById('clearChat');

chatBtn.addEventListener('click', () => chatBox.classList.toggle('hidden'));
closeChat.addEventListener('click', () => chatBox.classList.add('hidden'));

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const msg = chatInput.value.trim();
    if (msg) {
      addMessage('You', msg);
      saveChat(`<p><strong>You:</strong> ${msg}</p>`);
      respondToUser(msg);
      chatInput.value = '';
    }
  }
});

function addMessage(sender, text) {
  const p = document.createElement('p');
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatArea.appendChild(p);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function respondToUser(input) {
  const lower = input.toLowerCase();
  let response = "Hmm... I'm still learning. Try asking about David's projects or skills.";

  if (lower.includes('hello') || lower.includes('hi')) {
    response = "Greetings! I'm Javis, David's AI assistant. How can I help?";
  } else if (lower.includes('project')) {
    response = "David has built a Student Attachment Matching System using ML, a Tenant Management app, and this very portfolio!";
  } else if (lower.includes('skill') || lower.includes('tech')) {
    response = "David is skilled in HTML, CSS, JavaScript, Python, Machine Learning, Networking, and IT Support.";
  } else if (lower.includes('contact') || lower.includes('reach')) {
    response = "You can reach David via WhatsApp at +254768649781 or email at dmaloba903@gmail.com.";
  } else if (lower.includes('who are you') || lower.includes('javis')) {
    response = "I'm Javis — David's loyal AI assistant built into MalobaOS.";
  } else if (lower.includes('about') || lower.includes('david')) {
    response = "David is a final-year IT student at Kibabii University, graduating November 2026. He's passionate about web dev, networking, and AI.";
  } else if (lower.includes('cv') || lower.includes('resume')) {
    response = "You can download David's CV from the About section. Click the Download CV button!";
  } else if (lower.includes('location') || lower.includes('where')) {
    response = "David is based in Nairobi, Kenya.";
  }

  setTimeout(() => {
    addMessage('Javis', response);
    saveChat(`<p><strong>Javis:</strong> ${response}</p>`);
    speak(response);
  }, 400);
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang  = 'en-US';
  utterance.rate  = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// ===== VOICE INPUT =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  micBtn.addEventListener('click', () => {
    recognition.start();
    addMessage('Javis', 'Listening...');
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage('You', transcript);
    saveChat(`<p><strong>You:</strong> ${transcript}</p>`);
    respondToUser(transcript);
  };

  recognition.onerror = () => {
    addMessage('Javis', 'Sorry, I could not hear you. Please try again.');
  };
} else {
  micBtn.addEventListener('click', () => {
    addMessage('Javis', 'Voice input is not supported in your browser.');
  });
}

// ===== CHAT STORAGE =====
function saveChat(message) {
  const history = localStorage.getItem('javisChat') || '';
  localStorage.setItem('javisChat', history + message);
}

function loadChatHistory() {
  const saved = localStorage.getItem('javisChat');
  if (saved) chatArea.innerHTML = saved;
}

clearBtn.addEventListener('click', () => {
  chatArea.innerHTML = '';
  localStorage.removeItem('javisChat');
});

// ===== PROJECT MODAL =====
const modal      = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalIcon  = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalTech  = document.getElementById('modalTech');
const modalRole  = document.getElementById('modalRole');
const modalLink  = document.getElementById('modalLink');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    modalIcon.textContent  = card.dataset.icon;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent  = card.dataset.desc;
    modalRole.textContent  = card.dataset.role;

    const techList = card.dataset.tech.split(',');
    modalTech.innerHTML = techList.map(t => `<span>${t.trim()}</span>`).join('');

    const link = card.dataset.link;
    if (link && link !== '#') {
      modalLink.href = link;
      modalLink.style.display = 'inline-flex';
    } else {
      modalLink.style.display = 'none';
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ===== PROJECT FILTERS =====
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.category;
    projectCards.forEach(card => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

// ===== PARTICLES =====
window.onload = () => {
  loadChatHistory();

  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 900 } },
        color: { value: '#00f0ff' },
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 140, color: '#00f0ff', opacity: 0.25, width: 1 },
        move: { enable: true, speed: 1.5, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' }
        },
        modes: {
          repulse: { distance: 90 },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
};
