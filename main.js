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

    if (!response.ok) {
        return
    }

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
async function createCarrouselByCat(categoryName, numberFilms) {
    const sectionCategories = document.getElementById("categories");

    const category = document.createElement('section');
    category.classList.add('category');
    category.setAttribute("id", `${categoryName}`);

    const categoryTitle = document.createElement('h2');
    categoryTitle.classList.add("category-title");
    categoryTitle.innerHTML = categoryName;

    const carrouselContainer = document.createElement('div');
    carrouselContainer.classList.add('content-container');

    const carrousel = document.createElement('section');
    carrousel.classList.add('content');
    carrousel.setAttribute("id", `${categoryName}content`);

    const prevBtn = document.createElement('div');
    prevBtn.classList.add('btn-prev');
    prevBtn.classList.add('btn');
    prevBtn.setAttribute("name", "previous");
    prevBtn.setAttribute("id", "left");
    const prevBtnSymbol = document.createElement("div");
    prevBtnSymbol.innerHTML = "&#8249;";
    prevBtnSymbol.classList.add("symbol");
    prevBtn.appendChild(prevBtnSymbol);
    // prevBtn.setAttribute("onclick", `moveCarrouselBack(${categoryName}container)`);

    const nextBtn = document.createElement('div');
    nextBtn.classList.add('btn-next');
    nextBtn.classList.add('btn');
    nextBtn.setAttribute("name", "next");
    nextBtn.setAttribute("id", "right");
    const nextBtnSymbol = document.createElement("div");
    nextBtnSymbol.innerHTML = "&#8250;";
    nextBtnSymbol.classList.add("symbol");
    nextBtn.appendChild(nextBtnSymbol);

    // nextBtn.setAttribute("onclick", `moveCarrouselForward(${categoryName}container)`);
    const categoryData = await fetchCategories(categoryName, numberFilms);

    //* crée un article pour chaque film
    for (let i in categoryData) {
        const ficheFilm = document.createElement('div');
        const filmCover = document.createElement('img');


        ficheFilm.classList.add('film-article');

        filmCover.src = categoryData[i]["image_url"];
        filmCover.classList.add('img-article');
        filmCover.setAttribute("onclick", `openModal(${categoryData[i]["id"]})`);

        // carrousel.appendChild(filmCover);
        carrousel.appendChild(ficheFilm);
        ficheFilm.appendChild(filmCover);
    };

    sectionCategories.appendChild(category);
    category.appendChild(categoryTitle);
    category.appendChild(prevBtn);
    category.appendChild(nextBtn);
    category.appendChild(carrouselContainer);
    carrouselContainer.appendChild(carrousel);

    //répartion des éléments

    const fiches = carrousel.querySelectorAll(".film-article");
    let count = 0, positionLeft = 0, spaceRight = 0, dynamic = 0, marginLeft = 0, ef = 0;

    const ficheWidth = fiches[0].offsetWidth;
    console.log(ficheWidth)

    const ficheHeight = fiches[0].offsetHeight;
    console.log(ficheHeight)
    spaceRight = ficheWidth * (fiches.length);
    dynamic = ficheWidth * (fiches.length);
    category.style.maxWidth = ficheWidth * 7 + "px";
    carrouselContainer.style.maxWidth = ficheWidth * 7 + "px";
    carrousel.style.width = dynamic + "px";
    carrousel.style.maxHeight = 280 + "px";
    nextBtn.style.height = 280 + "px";
    prevBtn.style.height = 280 + "px";

    prevBtn.addEventListener("click", moveCarrouselBack);
    nextBtn.addEventListener("click", moveCarrouselForward);

    function moveCarrouselForward() {
        spaceFinal = spaceRight - category.offsetWidth;
        if (spaceFinal > 0) {
            positionLeft -= ficheWidth;
            marginLeft = positionLeft;
            spaceRight = dynamic + positionLeft

            ef = spaceRight - category.offsetWidth;
            count++;
            if (ef < 0) {
                carrousel.style.marginLeft = `${positionLeft + Math.abs(ef)}px`;
            } else {
                carrousel.style.marginLeft = `${positionLeft}px`;
            }
        }
    }

    function moveCarrouselBack() {
        if (count > 0) {
            positionLeft += ficheWidth;
            carrousel.style.marginLeft = `${positionLeft}px`;
            marginLeft = positionLeft;
            spaceRight = dynamic + positionLeft
            count--;
        }
    }
}

//* controle du Carrousel









//* modal
async function openModal(movieId) {   // ajouter un paramètre pour identifier le film en question
    let modal = document.getElementById("modal");
    let closeBtn = document.getElementsByClassName("close-btn")[0];

    await fetchModalData(movieId)

    modal.style.display = "grid";

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

    document.getElementById('movie-title').innerHTML = data["title"];
    document.getElementById('movie-year-dir').innerHTML = data["year"] + " - " + data["directors"];
    document.getElementById('movie-duration').innerHTML = data["duration"] + "mn";
    document.getElementById('movie-rated').innerHTML = data["rated"];
    document.getElementById('movie-genre').innerHTML = data["genres"]; //stocké sous forme de liste
    document.getElementById('movie-imdb').innerHTML = data["imdb-score"] + "/10";
    document.getElementById('movie-desc').innerHTML = data["description"];
    document.getElementById('movie-actors').innerHTML = data["actors"]; // stocké sous forme de liste
    document.getElementById('movie-country').innerHTML = data["countries"]; // stocké sous forme de liste  
    document.getElementById('movie-box-office').innerHTML = data["world_wide_gross_income"] + data["budget_currency"];
    document.getElementById('movie-cover').src = data["image_url"];
}



//* chargement de la page et màj des données
window.addEventListener('load', () => {
    fetchBest()
    createCarrouselByCat("Adventure", 10)
    createCarrouselByCat("Animation", 10)
    createCarrouselByCat("Sport", 10)
    createCarrouselByCat("Romance", 10)
    createCarrouselByCat("Sci-fi", 10)
});