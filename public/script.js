const params = new URLSearchParams(window.location.search);
const tipo = params.get('tipo');

const grid = document.getElementById('grid');
const titulo = document.getElementById('titulo');
const viewer = document.getElementById('viewer');
const conteudo = document.getElementById('conteudo');
const fechar = document.getElementById('fechar');

let pagina = 1;
let carregando = false;

/* favoritos salvos */
let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

function salvarFavoritos(){
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function criarBotaoFav(src, wrapper){
    const fav = document.createElement('div');
    fav.className = "fav";
    fav.innerHTML = "❤";

    if(favoritos.includes(src)) fav.classList.add("active");

    fav.onclick = (e)=>{
        e.stopPropagation();

        if(favoritos.includes(src)){
            favoritos = favoritos.filter(f=>f!==src);
            fav.classList.remove("active");
        }else{
            favoritos.push(src);
            fav.classList.add("active");
        }

        salvarFavoritos();
    };

    wrapper.appendChild(fav);
}

if(tipo){
    titulo.textContent = tipo.toUpperCase();
    carregarMidias();
}

async function carregarMidias(){
    if(carregando) return;
    carregando = true;

    const res = await fetch(`/api/${tipo}?pagina=${pagina}`);
    const arquivos = await res.json();

    arquivos.forEach(nome => {

        if(tipo === "fotos"){
            const wrapper = document.createElement('div');
            wrapper.className="thumb";

            const img = document.createElement('img');
            img.src = `${tipo}/${nome}`;
            img.onclick = () => abrirMidia('img', img.src);

            wrapper.appendChild(img);
            criarBotaoFav(img.src, wrapper);
            grid.appendChild(wrapper);
        }

        if(tipo === "videos"){
            criarThumbnailVideo(`${tipo}/${nome}`);
        }

    });

    pagina++;
    carregando = false;
}

/* thumbnail automática */
function criarThumbnailVideo(src){
    const wrapper = document.createElement('div');
    wrapper.className="thumb";
    wrapper.onclick = () => abrirMidia('video', src);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    video.addEventListener('loadeddata', () => {
        video.currentTime = 1;
    });

    video.addEventListener('seeked', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video,0,0,canvas.width,canvas.height);

        const img = document.createElement('img');
        img.src = canvas.toDataURL();

        wrapper.appendChild(img);
        criarBotaoFav(src, wrapper);
        grid.appendChild(wrapper);
    });
}

/* scroll infinito */
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 300){
        carregarMidias();
    }
});

/* abrir mídia */
function abrirMidia(tipo, src){
    viewer.style.display = "flex";
    conteudo.innerHTML = "";

    if(tipo === 'img'){
        const img = document.createElement('img');
        img.src = src;
        conteudo.appendChild(img);
    }else{
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        conteudo.appendChild(video);

        new Plyr(video,{
            controls:['play-large','play','progress','current-time','mute','volume','settings','fullscreen'],
            settings:['speed'],
            speed:{selected:1,options:[0.5,1,1.25,1.5,2]}
        });
    }
}

fechar.onclick = () => viewer.style.display = "none";
viewer.onclick = e => { if(e.target === viewer) viewer.style.display="none"; };