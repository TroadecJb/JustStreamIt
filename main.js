const mainURL = "http://localhost:8000/api/v1/titles/"


//* récupération des infos

async function fetchBest() {
    // variable des éléments du meilleur film
    const bestTitle = document.getElementById("best-title");
    const bestCover = document.getElementsByClassName('best-cover')[0].getElementsByTagName('img')[0];
    const bestDescrip = document.getElementById("top-desc");
    const bestModalBtn = document.getElementsByClassName("best-modalBtn")[0];
    // récupération des informations
    const response = await fetch(mainURL + "?sort_by=-imdb_score");
    const data = await response.json();
    const responseBestDescrip = await fetch(data["results"][0]["url"]);
    const dataBestDescrip = await responseBestDescrip.json();
    // assignation du contenu aux éléments 
    bestModalBtn.setAttribute("onclick", "openModal()");
    bestTitle.innerText = data["results"][0]["title"];
    bestCover.src = data["results"][0]["image_url"];
    bestDescrip.innerText = dataBestDescrip["description"];
}

async function fetchCategories(name) {
    const response = await fetch(mainURL + "?sort_by=-imdb_score&genre=" + name);
    const data = await response.json();

    return data
}

//* Création des éléments
async function createCarrouselByCat(categoryName, numberFilms) { // pas encore carrousel
    const catData = await fetchCategories(categoryName);
    const sectionCategories = document.getElementById("categories");

    const category = document.createElement('section');
    category.classList.add('category');
    const carrousel = document.createElement('section');
    carrousel.classList.add('container');
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerHTML = categoryName;
    const carrouselContent = document.createElement('div');
    carrouselContent.classList.add('carrousel-content');

    const navControl = document.createElement('div');
    navControl.classList.add("nav-control");
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('btn');
    prevBtn.setAttribute("name", "previous");
    prevBtn.setAttribute("id", "left");
    prevBtn.setAttribute("onclick", "moveCarrouselBack");
    prevBtn.innerHTML = "previous";
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('btn');
    nextBtn.setAttribute("name", "next");
    nextBtn.setAttribute("id", "right");
    nextBtn.setAttribute("onclick", "moveCarrouselForward");
    nextBtn.innerHTML = "next";


    navControl.appendChild(prevBtn);
    navControl.appendChild(nextBtn);


    sectionCategories.appendChild(category);
    category.appendChild(categoryTitle);
    category.appendChild(carrousel);
    carrousel.appendChild(carrouselContent);
    carrousel.appendChild(navControl);

    for (let i = 0; i < numberFilms; i++) {

        const dataDescription = await fetch(catData["results"][i]["url"]);
        const textDescription = await dataDescription.json();

        const ficheFilm = document.createElement('article');
        const filmTitre = document.createElement('h2');
        const filmCover = document.createElement('img');
        const filmDescription = document.createElement('p');
        const filmInfoBtn = document.createElement('button');

        filmTitre.innerText = catData["results"][i]["title"];
        filmDescription.innerHTML = textDescription["description"];
        filmCover.src = catData["results"][i]["image_url"];
        filmInfoBtn.classList.add('modalBtn');
        filmInfoBtn.setAttribute("onclick", `openModal()`);
        filmInfoBtn.innerHTML = "more info";


        carrouselContent.appendChild(ficheFilm);
        ficheFilm.appendChild(filmTitre);
        ficheFilm.appendChild(filmDescription);
        ficheFilm.appendChild(filmCover);
        ficheFilm.appendChild(filmInfoBtn);

    };
}

// controle du Carrousel
function moveCarrouselBack() {

}

function moveCarrouselForward() {

}
// modal
function openModal() {   // ajouter un paramètre pour identifier le film en question
    let modal = document.getElementById("modal");
    let closeBtn = document.getElementsByClassName("close-btn")[0];

    // ajouter fonction qui va récupérer les données du films et les assigner aux balises

    modal.style.display = "block";

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// function fetchDataModalFilm() { //ajouter paramètre pour identifier le film ?

// }



//* chargement de la page et màj des données

window.addEventListener('load', () => {
    fetchBest()
    createCarrouselByCat("Adventure", 3)
    createCarrouselByCat("Animation", 3)
    createCarrouselByCat("Sport", 3)
});