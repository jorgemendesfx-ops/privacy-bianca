const novidades = document.getElementById("novidades");

async function carregarNovidades(){

    const fotos = await fetch("/api/fotos?pagina=1").then(r=>r.json());
    const videos = await fetch("/api/videos?pagina=1").then(r=>r.json());

    const itens = [
        ...fotos.slice(0,4).map(f=>({tipo:"foto",src:`fotos/${f}`})),
        ...videos.slice(0,4).map(v=>({tipo:"video",src:`videos/${v}`}))
    ];

    itens.sort(()=>Math.random()-0.5);

    itens.forEach(item=>{
        const div = document.createElement("div");
        div.className="thumb";

        if(item.tipo==="foto"){
            const img = document.createElement("img");
            img.src=item.src;
            img.onclick=()=>window.location=`galeria.html?tipo=fotos`;
            div.appendChild(img);
        }else{
            criarPreviewVideo(item.src,div);
        }

        novidades.appendChild(div);
    });
}

function criarPreviewVideo(src,wrapper){

    const video=document.createElement("video");
    video.src=src;
    video.muted=true;
    video.loop=true;
    video.playsInline=true;
    video.preload="metadata";

    wrapper.appendChild(video);

    wrapper.addEventListener("mouseenter",()=>{
        video.currentTime=1;
        video.play();
    });

    wrapper.addEventListener("mouseleave",()=>{
        video.pause();
    });

    wrapper.onclick=()=>window.location=`galeria.html?tipo=videos`;
}

carregarNovidades();
window.addEventListener("scroll",()=>{
    const altura = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progresso = (window.scrollY / altura) * 100;
    document.getElementById("barraProgresso").style.width = progresso + "%";
});