// Configurações iniciais 
let slideAtual = 1;
const totalDeSlides = 13;
let videoPlayer;
let verificadorTempo;
let videoJaPosicionado = false;

// Carrega a API do YouTube 
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
    videoPlayer.cueVideoById({
        videoId: 'X3n4xRHQBuw',
        startSeconds: 8.5
    });
    videoJaPosicionado = true;
}

// Controla o estado do vídeo 
function aoMudarEstadoDoVideo(evento) {
    console.log('Estado do vídeo:', evento.data);
    
    if (evento.data === YT.PlayerState.PLAYING) {
        clearInterval(verificadorTempo);
        verificadorTempo = setInterval(() => {
            if (videoPlayer && videoPlayer.getCurrentTime) {
                const tempo = videoPlayer.getCurrentTime();
                if (tempo >= 200) { 
                    videoPlayer.pauseVideo();
                    clearInterval(verificadorTempo);
                }
            }
        }, 100);
    }

    if (evento.data === YT.PlayerState.PAUSED || evento.data === YT.PlayerState.ENDED) {
        clearInterval(verificadorTempo);
    }
}

// Função para ajustar para dispositivos móveis
function ajustarParaDispositivo() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Otimizações específicas para mobile
        document.body.style.overflowX = 'hidden';
        
        // Garante que o vídeo não sobrecarregue em mobile
        if (videoPlayer && slideAtual !== 2) {
            videoPlayer.pauseVideo();
        }
    }
}

// Mostra o slide atual
function mostrarSlide(numero) {
    const slides = document.querySelectorAll('.slide');
    const botaoAnterior = document.getElementById('prevBtn');
    const botaoProximo = document.getElementById('nextBtn');
    const contador = document.getElementById('currentSlide');

    // Garante que o número do slide está dentro do limite
    if (numero > totalDeSlides) slideAtual = totalDeSlides;
    if (numero < 1) slideAtual = 1;

    // Remove 'active' de todos e adiciona ao slide atual
    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideAtual - 1].classList.add('active');

    // Scroll para o topo quando entrar no slide 3
    if (slideAtual === 3) {
        setTimeout(() => {
            const creationContent = document.querySelector('.creation-content');
            if (creationContent) {
                creationContent.scrollTop = 0;
            }
        }, 100);
    }

    // Otimizações para mobile
    ajustarParaDispositivo();

    // Gerenciar vídeo ao entrar/sair do slide 2
    if (videoPlayer && typeof videoPlayer.pauseVideo === 'function') {
        if (slideAtual === 2) {
            if (videoJaPosicionado && typeof videoPlayer.cueVideoById === 'function') {
                videoPlayer.cueVideoById({
                    videoId: 'X3n4xRHQBuw',
                    startSeconds: 8.5
                });
            }
        } else {
            videoPlayer.pauseVideo();
            clearInterval(verificadorTempo);
        }
    }

    // Gerencia o estado dos botões de navegação
    botaoAnterior.disabled = slideAtual === 1;
    botaoProximo.disabled = slideAtual === totalDeSlides;

    // Atualiza o contador na tela
    contador.textContent = slideAtual;
}

// Muda o slide na direção especificada (+1 ou -1)
function mudarSlide(direcao) {
    slideAtual += direcao;
    mostrarSlide(slideAtual);
}

// Adiciona navegação por setas do teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mudarSlide(1);
    if (e.key === 'ArrowLeft') mudarSlide(-1);
});

// Chame esta função quando a janela for redimensionada
window.addEventListener('resize', ajustarParaDispositivo);

// E também no carregamento inicial
window.addEventListener('load', ajustarParaDispositivo);

// Inicializa o slider
mostrarSlide(slideAtual);