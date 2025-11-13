// Configurações iniciais 
let slideAtual = 1;
// TOTAL DE SLIDES AJUSTADO PARA 7
const totalDeSlides = 7; 
let videoPlayer;
let verificadorTempo;
let videoJaPosicionado = false;
let animacaoDiasAtiva = false;

// ... o resto do código permanece igual

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
    // Pre-carrega o vídeo com o tempo de início
    videoPlayer.cueVideoById({
        videoId: 'X3n4xRHQBuw',
        startSeconds: 8.5
    });
    videoJaPosicionado = true;
}

// Controla o estado do vídeo 
function aoMudarEstadoDoVideo(evento) {
    console.log('Estado do vídeo:', evento.data);
    
    // Inicia o verificador de tempo ao começar a tocar
    if (evento.data === YT.PlayerState.PLAYING) {
        clearInterval(verificadorTempo);
        verificadorTempo = setInterval(() => {
            if (videoPlayer && videoPlayer.getCurrentTime) {
                const tempo = videoPlayer.getCurrentTime();
                // Pausa o vídeo ao atingir 200 segundos (ajuste se necessário)
                if (tempo >= 200) { 
                    videoPlayer.pauseVideo();
                    clearInterval(verificadorTempo);
                }
            }
        }, 100);
    }

    // Limpa o verificador se o vídeo pausar ou terminar
    if (evento.data === YT.PlayerState.PAUSED || evento.data === YT.PlayerState.ENDED) {
        clearInterval(verificadorTempo);
    }
}

// FUNÇÃO: Faz scroll automático para o último dia visível
function fazerScrollParaDiaAtual() {
    const diasVisiveis = document.querySelectorAll('.day-item.show');
    if (diasVisiveis.length > 0) {
        const ultimoDiaVisivel = diasVisiveis[diasVisiveis.length - 1];
        ultimoDiaVisivel.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// FUNÇÃO: Anima os 7 dias sequencialmente COM SCROLL
function animarDiasDaCriacao() {
    if (animacaoDiasAtiva) return;
    animacaoDiasAtiva = true;

    const diasItems = document.querySelectorAll('.day-item');
    
    // Esconde todos antes de começar
    diasItems.forEach(item => item.classList.remove('show'));
    
    diasItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
            // Faz scroll automático após cada dia aparecer
            setTimeout(() => {
                fazerScrollParaDiaAtual();
            }, 300);
        }, index * 600); // 600ms de intervalo entre a aparição de cada dia
    });
}

// FUNÇÃO: Reseta a animação dos dias
function resetarAnimacaoDias() {
    animacaoDiasAtiva = false;
    const diasItems = document.querySelectorAll('.day-item');
    diasItems.forEach(item => item.classList.remove('show'));
}

// --- Mostra o slide atual ---
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

    // Scroll para o topo quando entrar no slide 3 (A Criação)
    if (slideAtual === 3) {
        setTimeout(() => {
            const creationContent = document.querySelector('.creation-content');
            if (creationContent) {
                creationContent.scrollTop = 0;
            }
        }, 100);
    }

    // Gerenciar vídeo ao entrar/sair do slide 2
    if (videoPlayer && typeof videoPlayer.pauseVideo === 'function') {
        if (slideAtual === 2) {
            // Posiciona e prepara o vídeo
            if (videoJaPosicionado && typeof videoPlayer.cueVideoById === 'function') {
                videoPlayer.cueVideoById({
                    videoId: 'X3n4xRHQBuw',
                    startSeconds: 8.5
                });
            }
        } else {
            // Pausa o vídeo e limpa o verificador em outros slides
            videoPlayer.pauseVideo();
            clearInterval(verificadorTempo);
        }
    }

    // Inicia animação dos dias quando entrar no slide 3
    if (slideAtual === 3) {
        setTimeout(() => {
            animarDiasDaCriacao();
        }, 300);
    } else {
        // Reseta a animação ao sair
        resetarAnimacaoDias();
    }

    // Gerencia o estado dos botões de navegação
    botaoAnterior.disabled = slideAtual === 1;
    botaoProximo.disabled = slideAtual === totalDeSlides;

    // Atualiza o contador na tela
    contador.textContent = slideAtual;
}

// FUNÇÃO: Muda o slide na direção especificada (+1 ou -1)
function mudarSlide(direcao) {
    slideAtual += direcao;
    mostrarSlide(slideAtual);
}

// Adiciona navegação por setas do teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mudarSlide(1);
    if (e.key === 'ArrowLeft') mudarSlide(-1);
});

// Inicializa o slider
mostrarSlide(slideAtual);