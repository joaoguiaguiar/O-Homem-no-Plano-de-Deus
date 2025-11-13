//  Configurações iniciais 
let slideAtual = 1;
const totalDeSlides = 2; // Alterado de 3 para 2
let videoPlayer;
let verificadorTempo;
let videoJaPosicionado = false;

//  Carrega a API do YouTube 
const scriptYoutube = document.createElement('script');
scriptYoutube.src = "https://www.youtube.com/iframe_api";
const primeiroScript = document.getElementsByTagName('script')[0];
primeiroScript.parentNode.insertBefore(scriptYoutube, primeiroScript);

// Função chamada automaticamente quando a API estiver pronta 
function onYouTubeIframeAPIReady() {
    videoPlayer = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'X3n4xRHQBuw',
        playerVars: {
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            autoplay: 0
        },
        events: {
            onReady: aoVideoFicarPronto,
            onStateChange: aoMudarEstadoDoVideo
        }
    });
}

// Função executada quando o player estiver totalmente carregado
function aoVideoFicarPronto(evento) {
    console.log('Player pronto');
    // Carrega o vídeo e posiciona em 8.5 segundos
    videoPlayer.cueVideoById({
        videoId: 'X3n4xRHQBuw',
        startSeconds: 8.5
    });
    videoJaPosicionado = true;
}

// Controla o estado do vídeo 
function aoMudarEstadoDoVideo(evento) {
    console.log('Estado do vídeo:', evento.data);
    
    // Quando o vídeo começar a tocar
    if (evento.data === YT.PlayerState.PLAYING) {
        // Inicia verificador para pausar em 198s
        clearInterval(verificadorTempo);
        verificadorTempo = setInterval(() => {
            if (videoPlayer && videoPlayer.getCurrentTime) {
                const tempo = videoPlayer.getCurrentTime();

                // Pausar exatamente em 3:20 (200 segundos)
                if (tempo >= 200) {
                    videoPlayer.pauseVideo();
                    clearInterval(verificadorTempo);
                }
            }
        }, 100);
    }

    // Limpa o intervalo se o vídeo pausar ou terminar
    if (evento.data === YT.PlayerState.PAUSED || evento.data === YT.PlayerState.ENDED) {
        clearInterval(verificadorTempo);
    }
}

// --- Mostra o slide atual ---
function mostrarSlide(numero) {
    const slides = document.querySelectorAll('.slide');
    const botaoAnterior = document.getElementById('prevBtn');
    const botaoProximo = document.getElementById('nextBtn');
    const contador = document.getElementById('currentSlide');

    if (numero > totalDeSlides) slideAtual = totalDeSlides;
    if (numero < 1) slideAtual = 1;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideAtual - 1].classList.add('active');

    // Gerenciar vídeo ao entrar/sair do slide 2 (que agora é o slide do vídeo)
    if (videoPlayer && typeof videoPlayer.pauseVideo === 'function') {
        if (slideAtual === 2) {
            // Ao entrar no slide do vídeo
            if (videoJaPosicionado && typeof videoPlayer.cueVideoById === 'function') {
                videoPlayer.cueVideoById({
                    videoId: 'X3n4xRHQBuw',
                    startSeconds: 8.5
                });
            }
        } else {
            // Ao sair do slide do vídeo, pausa
            videoPlayer.pauseVideo();
            clearInterval(verificadorTempo);
        }
    }

    botaoAnterior.disabled = slideAtual === 1;
    botaoProximo.disabled = slideAtual === totalDeSlides;

    contador.textContent = slideAtual;
}

function mudarSlide(direcao) {
    slideAtual += direcao;
    mostrarSlide(slideAtual);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mudarSlide(1);
    if (e.key === 'ArrowLeft') mudarSlide(-1);
});

mostrarSlide(slideAtual);