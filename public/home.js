const novidades = document.getElementById("novidades");

async function carregarNovidades(){

```
const fotos = await fetch("/api/fotos?pagina=1").then(r=>r.json());
const videos = await fetch("/api/videos?pagina=1").then(r=>r.json());

const itens = [
    ...fotos.slice(0,4).map(f=>({tipo:"foto",src:`/fotos/${f}`})),
    ...videos.slice(0,4).map(v=>({tipo:"video",src:`/videos/${v}`}))
];

itens.sort(()=>Math.random()-0.5);

itens.forEach(item=>{
    const div = document.createElement("div");
    div.className="thumb";

    if(item.tipo==="foto"){
        const img = document.createElement("img");
        img.src=item.src;

        div.onclick=()=>{
            window.location.href=`/galeria.html?tipo=fotos&abrir=${encodeURIComponent(item.src)}`;
        };

        div.appendChild(img);

    }else{

        const capa=document.createElement("div");
        capa.className="video-box";
        capa.innerHTML="▶";

        div.onclick=()=>{
            window.location.href=`/galeria.html?tipo=videos&abrir=${encodeURIComponent(item.src)}`;
        };

        div.appendChild(capa);
    }

    novidades.appendChild(div);
});
```

}

carregarNovidades();

/* barra progresso */
window.addEventListener("scroll",()=>{
const altura = document.documentElement.scrollHeight - document.documentElement.clientHeight;
const progresso = (window.scrollY / altura) * 100;
const barra = document.getElementById("barraProgresso");
if(barra) barra.style.width = progresso + "%";
});
