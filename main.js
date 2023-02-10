const mainURL = "http://localhost:8000/api/v1/titles/"


//* récupération des infos

async function fetchBest() {
    // variable des éléments du meilleur film
    const bestTitle = document.getElementById("best-title");
    const bestCover = document.getElementsByClassName('best-cover')[0].getElementsByTagName('img')[0];
    const bestDescrip = document.getElementById("top-desc");
    // récupération des informations
    const response = await fetch(mainURL + "?sort_by=-imdb_score");
    const data = await response.json();
    const responseBestDescrip = await fetch(data["results"][0]["url"]);
    const dataBestDescrip = await responseBestDescrip.json();
    // assignation du contenu aux éléments 
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
async function createElementByCat(categoryName, numberFilms) {
    const catData = await fetchCategories(categoryName);
    const sectionCategories = document.getElementById("categories");

    const newCategory = document.createElement('section');
    newCategory.classList.add('category');
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerHTML = categoryName;

    sectionCategories.appendChild(newCategory);
    newCategory.appendChild(categoryTitle);

    for (let i = 0; i < numberFilms; i++) {

        const dataDescription = await fetch(catData["results"][i]["url"]);
        const textDescription = await dataDescription.json();

        const articleCategory = document.createElement('article');
        const filmTitre = document.createElement('h2');
        const filmCover = document.createElement('img');
        const filmDescription = document.createElement('p');


        filmTitre.innerText = catData["results"][i]["title"];
        filmDescription.innerHTML = textDescription["description"];
        filmCover.src = catData["results"][i]["image_url"];


        newCategory.appendChild(articleCategory);
        articleCategory.appendChild(filmTitre);
        articleCategory.appendChild(filmDescription);
        articleCategory.appendChild(filmCover);

    };
}









//* exemple de modal
function modal() {
    el = document.getElementById("myModal");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
let btn = document.getElementById("info-btn");
btn.addEventListener("click", modal);

//* chargement de la page et màj des données

window.addEventListener('load', () => {
    fetchBest()
    createElementByCat("Adventure", 3)
    createElementByCat("Animation", 3)
    createElementByCat("Sport", 3)
});