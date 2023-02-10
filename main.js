const mainURL = "http://localhost:8000/api/v1/titles/"

async function fetchBest() {
    const bestTitle = document.getElementById("best-title");
    const bestCover = document.getElementsByClassName('best-cover')[0].getElementsByTagName('img')[0];
    const bestDescrip = document.getElementById("top-desc");

    const response = await fetch(mainURL + "?sort_by=-imdb_score");
    const data = await response.json();
    const responseBestDescrip = await fetch(data["results"][0]["url"]);
    const dataBestDescrip = await responseBestDescrip.json();

    bestTitle.innerText = data["results"][0]["title"];
    bestCover.src = data["results"][0]["image_url"];
    bestDescrip.innerText = dataBestDescrip["description"];




}

// async function fetchCategories(name, max_number) {
//     const catResults = await fetch(mainURL + "?sort_by=-imdb_score&genre=" + name);

//     const para = document.getElementById('bordel');

//     const catData = await catResults.json();
//     const filmsData = Array(catData["results"]);

//     para.innerHTML = ;
// }

function modal() {
    el = document.getElementById("myModal");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

var btn = document.getElementById("info-btn");

btn.addEventListener("click", modal);

window.addEventListener('load', () => {
    fetchBest()
    fetchCategories()
});