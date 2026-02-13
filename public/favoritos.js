const grid = document.getElementById('grid');
const viewer = document.getElementById('viewer');
const conteudo = document.getElementById('conteudo');
const fechar = document.getElementById('fechar');

let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

favoritos.forEach(src => {

    const wrapper = document.createElement('div');
    wrapper.className = "thumb";
    wrapper.onclick = () => abrirMidia(src);

    if(src.includes("videos")){
        gerarThumbVideo(src, wrapper);
    }else{
        const img = document.createElement('img');
        img.src = src;
        wrapper.appendChild(img);
    }

    grid.appendChild(wrapper);
});

function gerarThumbVideo(src, wrapper){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => video.currentTime = 1);

    video.addEventListener('seeked', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video,0,0,canvas.width,canvas.height);

        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        wrapper.appendChild(img);
    });
}

function abrirMidia(src){
    viewer.style.display = "flex";
    conteudo.innerHTML = "";

    if(src.includes("videos")){
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        conteudo.appendChild(video);
        new Plyr(video);
    }else{
        const img = document.createElement('img');
        img.src = src;
        conteudo.appendChild(img);
    }
}

fechar.onclick = () => viewer.style.display = "none";
viewer.onclick = e => { if(e.target === viewer) viewer.style.display="none"; };