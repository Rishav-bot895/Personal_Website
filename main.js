const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');
const startOverlay = document.getElementById('startOverlay');
const coinButton = document.getElementById('coinButton');
const commandForm = document.getElementById('commandForm');
const commandInput = document.getElementById('commandInput');
const commandOutput = document.getElementById('commandOutput');
const commandTerminal = document.getElementById('commandTerminal');
const terminalToggle = document.getElementById('terminalToggle');

let gameStarted = false;

function playCoinSound() {
    if (prefersReducedMotion) {
        return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
        return;
    }

    const audioContext = new AudioContext();
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.32);

    [880, 1320].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.08);
        oscillator.connect(gain);
        oscillator.start(audioContext.currentTime + index * 0.08);
        oscillator.stop(audioContext.currentTime + 0.2 + index * 0.08);
    });
}

function startGame() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;
    coinButton.textContent = 'BOOTING...';
    startOverlay.classList.add('booting');
    playCoinSound();

    window.setTimeout(() => {
        coinButton.textContent = 'PLAYER 1 READY';
    }, prefersReducedMotion ? 80 : 420);

    window.setTimeout(() => {
        document.body.classList.add('game-started');
        document.body.style.overflow = '';
        updateActiveLink();
    }, prefersReducedMotion ? 180 : 900);
}

coinButton.addEventListener('click', startGame);

function setTerminalOpen(isOpen) {
    commandTerminal.classList.toggle('is-collapsed', !isOpen);
    terminalToggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
        commandInput.focus();
    }
}

terminalToggle.addEventListener('click', () => {
    setTerminalOpen(commandTerminal.classList.contains('is-collapsed'));
});

function updateKeyboardOffset() {
    if (!window.visualViewport) {
        document.documentElement.style.setProperty('--keyboard-offset', '0px');
        return;
    }

    const viewport = window.visualViewport;
    const keyboardOffset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    document.documentElement.style.setProperty('--keyboard-offset', `${Math.round(keyboardOffset)}px`);
}

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateKeyboardOffset);
    window.visualViewport.addEventListener('scroll', updateKeyboardOffset);
}

commandInput.addEventListener('focus', updateKeyboardOffset);
commandInput.addEventListener('blur', () => {
    window.setTimeout(updateKeyboardOffset, 120);
});

window.addEventListener('load', () => {
    if (!document.body.classList.contains('game-started')) {
        coinButton.focus();
    }

    updateKeyboardOffset();
});

function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        const href = anchor.getAttribute('href');
        const target = href && document.querySelector(href);

        if (!target) {
            return;
        }

        event.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    });
});

mobileMenu.addEventListener('click', event => {
    if (event.target === mobileMenu) {
        closeMobileMenu();
    }
});

document.addEventListener('keydown', event => {
    if (!gameStarted && event.key === 'Enter') {
        event.preventDefault();
        startGame();
        return;
    }

    if (event.key === 'Escape') {
        closeMobileMenu();
        closeResume();
    }
});

function updateActiveLink() {
    const scrollPosition = window.scrollY + 120;
    let activeId = 'hero';

    sections.forEach(section => {
        if (scrollPosition >= section.offsetTop) {
            activeId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });

    navbar.classList.toggle('scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('load', updateActiveLink);

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    if (prefersReducedMotion) {
        element.classList.add('visible');
    } else {
        revealObserver.observe(element);
    }
});

const resumeBtn = document.getElementById('resumeBtn');
const resumeModal = document.getElementById('resumeModal');
const closeResumeModal = document.getElementById('closeResumeModal');

function openResume() {
    if (document.activeElement === commandInput) {
        commandInput.blur();
        updateKeyboardOffset();
    }

    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeResumeModal.focus();
}

function closeResume() {
    if (!resumeModal.classList.contains('active')) {
        return;
    }

    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
    resumeBtn.focus();
}

resumeBtn.addEventListener('click', openResume);
closeResumeModal.addEventListener('click', closeResume);
resumeModal.addEventListener('click', event => {
    if (event.target === resumeModal) {
        closeResume();
    }
});

function appendCommandLine(text) {
    const line = document.createElement('p');
    line.textContent = text;
    commandOutput.appendChild(line);

    while (commandOutput.children.length > 6) {
        commandOutput.removeChild(commandOutput.firstElementChild);
    }

    commandOutput.scrollTop = commandOutput.scrollHeight;
}

const commandHandlers = {
    help: {
        message: 'available commands: bio, stages, skills, badges, projects, experience, contact, resume',
        target: null
    },
    bio: {
        message: 'Opening player_bio.exe...',
        target: '#about'
    },
    stages: {
        message: 'Loading stage select...',
        target: '#education'
    },
    skills: {
        message: 'Opening inventory manifest...',
        target: '#skills'
    },
    badges: {
        message: 'Opening certificate badges...',
        target: '#skills'
    },
    projects: {
        message: 'Loading project cabinets...',
        target: '#projects'
    },
    experience: {
        message: 'Loading career mode...',
        target: '#experience'
    },
    contact: {
        message: 'Opening transmission channel...',
        target: '#contact'
    },
    resume: {
        message: 'Mounting resume.pdf...',
        action: openResume
    }
};

commandForm.addEventListener('submit', event => {
    event.preventDefault();

    const rawCommand = commandInput.value.trim();
    const command = rawCommand.toLowerCase();

    if (!command) {
        return;
    }

    appendCommandLine(`> ${rawCommand}`);
    commandInput.value = '';

    const handler = commandHandlers[command];

    if (!handler) {
        appendCommandLine(`Unknown command: ${rawCommand}. Type help.`);
        return;
    }

    appendCommandLine(handler.message);

    if (handler.target) {
        document.querySelector(handler.target).scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    }

    if (handler.action) {
        handler.action();
    }
});

function initGridShader() {
    const canvas = document.getElementById('gridCanvas');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });

    if (!gl) {
        return;
    }

    const vertexSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;

        float gridLine(float value, float width) {
            float distanceToLine = abs(fract(value) - 0.5);
            return 1.0 - smoothstep(0.5 - width, 0.5, distanceToLine);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec2 centered = uv * 2.0 - 1.0;
            centered.x *= u_resolution.x / u_resolution.y;

            float horizon = 0.24;
            float y = max(uv.y - horizon, 0.001);
            float perspective = 1.0 / y;
            float crawl = u_time * 0.045;

            float vertical = gridLine(centered.x * perspective * 1.65, 0.04);
            float horizontal = gridLine((perspective * 0.75) + crawl, 0.035);
            float mask = smoothstep(horizon, 0.95, uv.y) * (1.0 - smoothstep(0.92, 1.0, uv.y));
            float glow = max(vertical, horizontal) * mask;

            vec3 color = vec3(glow);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    function resize() {
        const width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
        const height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
        }
    }

    function render(time) {
        resize();
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, time * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (!prefersReducedMotion) {
            requestAnimationFrame(render);
        }
    }

    render(0);
}

initGridShader();
