(function(){

    const liberado = sessionStorage.getItem("acesso");
    const paginaAtual = window.location.pathname;

    if(liberado !== "liberado" && !paginaAtual.includes("lock.html")){
        window.location = "/lock.html";
    }

})();