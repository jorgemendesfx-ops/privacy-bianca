const params = new URLSearchParams(window.location.search);
const tipo = params.get('tipo');
const abrirDireto = params.get('abrir');

const grid = document.getElementById('grid');
const titulo = document.getElementById('titulo');
const viewer = document.getElementById('viewer');
const conteudo = document.getElementById('conteudo');
const fechar = document.getElementById('fechar');

let pagina = 1;
let carregando = false;
let abriuAutomatico = false;

/* favoritos */
let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

function salvarFavoritos(){
localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function criarBotaoFav(src, wrapper){
const fav = document.createElement('div');
fav.className = "fav";
fav.innerHTML = "❤";

```
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
```

}

/* iniciar */
if(tipo){
titulo.textContent = tipo.toUpperCase();
carregarMidias();
}

/* carregar midias */
async function carregarMidias(){
if(carregando) return;
carregando = true;

```
const res = await fetch(`/api/${tipo}?pagina=${pagina}`);
const arquivos = await res.json();

arquivos.forEach(nome => {

    const wrapper = document.createElement('div');
    wrapper.className="thumb";

    if(tipo === "fotos"){
        const src = `/${tipo}/${nome}`;

        const img = document.createElement('img');
        img.src = src;
        img.onclick = () => abrirMidia('img', src);

        wrapper.appendChild(img);
        criarBotaoFav(src, wrapper);

        /* abrir direto */
        if(!abriuAutomatico && abrirDireto === src){
            abriuAutomatico = true;
            setTimeout(()=>abrirMidia('img',src),200);
        }
    }

    if(tipo === "videos"){
        const src = `/${tipo}/${nome}`;

        const capa = document.createElement('div');
        capa.className="video-box";
        capa.innerHTML="▶";

        wrapper.onclick = () => abrirMidia('video', src);

        wrapper.appendChild(capa);
        criarBotaoFav(src, wrapper);

        /* abrir direto */
        if(!abriuAutomatico && abrirDireto === src){
            abriuAutomatico = true;
            setTimeout(()=>abrirMidia('video',src),200);
        }
    }

    grid.appendChild(wrapper);
});

pagina++;
carregando = false;
```

}

/* scroll infinito */
window.addEventListener('scroll', () => {
if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 300){
carregarMidias();
}
});

/* visualizador */
function abrirMidia(tipo, src){
viewer.style.display = "flex";
conteudo.innerHTML = "";

```
if(tipo === 'img'){
    const img = document.createElement('img');
    img.src = src;
    conteudo.appendChild(img);
}else{
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.playsInline = true;
    video.setAttribute("playsinline","");
    video.setAttribute("webkit-playsinline","");
    conteudo.appendChild(video);
}
```

}

fechar.onclick = () => viewer.style.display = "none";
viewer.onclick = e => { if(e.target === viewer) viewer.style.display="none"; };
