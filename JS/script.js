let currentSlide = 1;
const totalSlides = 3;
let player;
let checkInterval;

// Carregar API do YouTube
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Função chamada automaticamente quando a API estiver pronta
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'X3n4xRHQBuw',
        playerVars: {
            'start': 8,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // Quando o vídeo começar a tocar
    if (event.data == YT.PlayerState.PLAYING) {
        // Verificar a cada 500ms se chegou aos 198 segundos
        checkInterval = setInterval(() => {
            if (player && player.getCurrentTime) {
                const currentTime = player.getCurrentTime();
                if (currentTime >= 198) {
                    player.pauseVideo();
                    clearInterval(checkInterval);
                }
            }
        }, 500);
    }

    // Limpar intervalo quando pausar/parar
    if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        clearInterval(checkInterval);
    }
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const counter = document.getElementById('currentSlide');

    if (n > totalSlides) currentSlide = totalSlides;
    if (n < 1) currentSlide = 1;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide - 1].classList.add('active');

    // Pausar vídeo ao sair do slide
    if (player && player.pauseVideo && currentSlide !== 3) {
        player.pauseVideo();
        clearInterval(checkInterval);
    }

    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    counter.textContent = currentSlide;
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') changeSlide(1);
    if (e.key === 'ArrowLeft') changeSlide(-1);
});

showSlide(currentSlide);