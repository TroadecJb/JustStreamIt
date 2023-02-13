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
    bestModalBtn.setAttribute("onclick", `openModal(${data["results"][0]["id"]})`);

}

async function fetchCategories(name, maxFilm) {
    const response = await fetch(mainURL + "?sort_by=-imdb_score&genre=" + name);

    if (!response.ok)
        return

    const data = await response.json();

    let movieData = Array(...data.results); // crée une liste à partir de la clef "results", avec les 5 premiers films(longueur d'une page get de l'api)

    if (movieData.length < maxFilm) {
        const secondResponse = await fetch(data.next);
        const secondData = await secondResponse.json();
        const listSecondData = Array(...secondData.results);
        movieData.push(...listSecondData);
    };

    return movieData;
}

//* Création des éléments carrousel
async function createCarrouselByCat(categoryName, numberFilms) { // pas encore carrousel
    const sectionCategories = document.getElementById("categories");

    const category = document.createElement('section');
    category.classList.add('category');
    sectionCategories.appendChild(category);

    const categoryTitle = document.createElement('h2');
    categoryTitle.innerHTML = categoryName;
    category.appendChild(categoryTitle);

    const carrousel = document.createElement('section');
    carrousel.classList.add('container');
    category.appendChild(carrousel);

    const prevBtn = document.createElement('button');
    prevBtn.classList.add('btn');
    prevBtn.setAttribute("name", "previous");
    prevBtn.setAttribute("id", "left");
    prevBtn.setAttribute("onclick", `moveCarrouselBack()`);
    prevBtn.innerHTML = "previous";
    carrousel.appendChild(prevBtn);

    const carrouselContent = document.createElement('div');
    carrouselContent.classList.add('carrousel-content');
    carrouselContent.setAttribute("id", `${categoryName}-container`);
    carrousel.appendChild(carrouselContent);

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('btn');
    nextBtn.setAttribute("name", "next");
    nextBtn.setAttribute("id", "right");
    nextBtn.setAttribute("onclick", `moveCarrouselForward()`);
    nextBtn.innerHTML = "next";
    carrousel.appendChild(nextBtn);

    console.log(categoryName + "-container");

    const categoryData = await fetchCategories(categoryName, numberFilms);

    // crée un article pour chaque film
    for (let i in categoryData) {
        const ficheFilm = document.createElement('article');
        const filmCover = document.createElement('img');
        const filmInfoBtn = document.createElement('button');

        ficheFilm.classList.add('film-article');
        filmCover.src = categoryData[i]["image_url"];
        filmInfoBtn.classList.add('modalBtn');
        filmInfoBtn.classList.add('btn');
        filmInfoBtn.setAttribute("onclick", `openModal(${categoryData[i]["id"]})`);
        filmInfoBtn.innerHTML = "more info";

        carrouselContent.appendChild(ficheFilm);
        ficheFilm.appendChild(filmInfoBtn);
        ficheFilm.appendChild(filmCover);

        const ficheFilmWidth = ficheFilm.getBoundingClientRect().width;

        ficheFilm.style.left = ficheFilmWidth * i + "px";

    };
}

// controle du Carrousel
function moveCarrouselBack() {
    let fichesCarousel = document.getElementsByClassName('film-article');
    let listFichesCarousel = Array(...fichesCarousel);
    let ficheFilmWidth = listFichesCarousel[0].getBoundingClientRect().width;
    console.log(ficheFilmWidth);


    for (let i in listFichesCarousel) {
        const ficheWidth = listFichesCarousel[i].getBoundingClientRect().width;
        const currentPosition = listFichesCarousel[i].style.left;
        const cal = ficheWidth - currentPosition;
        console.log(cal);
        console.log(ficheWidth);
        console.log(currentPosition);
        listFichesCarousel[i].style.left = currentPosition - ficheWidth + 'px';
    };



    // for (let i in Array(...carousel)) {

    //     carrousel[i].style.left = ficheFilmWidth * i + "px";
    // };


}

// modal
function openModal(movieId) {   // ajouter un paramètre pour identifier le film en question
    let modal = document.getElementById("modal");
    let closeBtn = document.getElementsByClassName("close-btn")[0];

    fetchModalData(movieId)

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

async function fetchModalData(movieId) { //ajouter paramètre pour identifier le film ?
    const response = await fetch(mainURL + movieId);
    const data = await response.json();

    document.getElementById('modal-title').innerHTML = data["title"];
    document.getElementById('modal-year').innerHTML = data["year"];
    document.getElementById('modal-rated').innerHTML = data["rated"];
    document.getElementById('modal-imdb').innerHTML = data["imdb-score"] + " /10";
    document.getElementById('modal-duration').innerHTML = data["duration"] + " min";
    document.getElementById('modal-director').innerHTML = data["directors"]; //stocké sous forme de liste
    document.getElementById('modal-actors').innerHTML = data["actors"]; // stocké sous forme de liste
    document.getElementById('modal-pitch').innerHTML = data["description"];
    document.getElementById('modal-genre').innerHTML = data["genres"]; //stocké sous forme de liste
    document.getElementById('modal-country').innerHTML = data["countries"]; // stocké sous forme de liste
    document.getElementById('modal-box-office').innerHTML = data["world_wide_gross_income"] + data["budget_currency"];
    document.getElementById('modal-cover').src = data["image_url"];

}



//* chargement de la page et màj des données

window.addEventListener('load', () => {
    fetchBest()
    createCarrouselByCat("Adventure", 10)
    createCarrouselByCat("Animation", 3)
    createCarrouselByCat("Sport", 7)
    createCarrouselByCat("Sci-fi", 7)
});