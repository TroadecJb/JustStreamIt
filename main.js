const mainURL = "http://localhost:8000/api/v1/titles/"


//* récupération des infos

async function fetchBest() {
    // récupération des informations
    const response = await fetch(mainURL + "?sort_by=-imdb_score");
    const data = await response.json();
    const responseBestDescrip = await fetch(data["results"][0]["url"]);
    const dataBestDescrip = await responseBestDescrip.json();

    // variable des éléments du meilleur film
    const bestTitle = document.getElementById("best-title");
    bestTitle.innerText = data["results"][0]["title"];

    const bestCover = document.getElementsByClassName('best-cover')[0].getElementsByTagName('img')[0];
    bestCover.src = data["results"][0]["image_url"];

    const bestDescrip = document.getElementById("top-desc");
    bestDescrip.innerText = dataBestDescrip["description"];

    const bestModalBtn = document.getElementsByClassName("best-modalBtn")[0];
    bestModalBtn.setAttribute("onclick", "openModal()");





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
    sectionCategories.appendChild(category);

    const carrousel = document.createElement('section');
    carrousel.classList.add('container');
    category.appendChild(carrousel);

    const categoryTitle = document.createElement('h2');
    categoryTitle.innerHTML = categoryName;
    category.appendChild(categoryTitle);

    const carrouselContent = document.createElement('div');
    carrouselContent.classList.add('carrousel-content');
    carrouselContent.setAttribute("id", `${categoryName}`);
    carrousel.appendChild(carrouselContent);

    // navigation control
    const navControl = document.createElement('div');
    navControl.classList.add("nav-control");
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('btn');
    prevBtn.setAttribute("name", "previous");
    prevBtn.setAttribute("id", "left");
    prevBtn.setAttribute("onclick", "moveCarrouselBack");
    prevBtn.innerHTML = "previous";
    navControl.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('btn');
    nextBtn.setAttribute("name", "next");
    nextBtn.setAttribute("id", "right");
    nextBtn.setAttribute("onclick", "moveCarrouselForward");
    nextBtn.innerHTML = "next";
    navControl.appendChild(nextBtn);

    carrousel.appendChild(navControl);

    for (let i = 0; i < numberFilms; i++) {

        const dataDescription = await fetch(catData["results"][i]["url"]);
        const textDescription = await dataDescription.json();

        const ficheFilm = document.createElement('article');
        const filmTitre = document.createElement('h2');
        const filmCover = document.createElement('img');
        const filmDescription = document.createElement('p');
        const filmInfoBtn = document.createElement('button');
        const filmTextContainer = document.createElement('div');

        ficheFilm.classList.add('film-article');
        filmTitre.innerText = catData["results"][i]["title"];
        filmDescription.innerHTML = textDescription["description"];
        filmCover.src = catData["results"][i]["image_url"];
        filmInfoBtn.classList.add('modalBtn');
        filmInfoBtn.setAttribute("onclick", `openModal()`);
        filmInfoBtn.innerHTML = "more info";


        carrouselContent.appendChild(ficheFilm);
        ficheFilm.appendChild(filmTextContainer);
        filmTextContainer.appendChild(filmTitre);
        filmTextContainer.appendChild(filmDescription);
        filmTextContainer.appendChild(filmInfoBtn);
        ficheFilm.appendChild(filmCover);

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