const parentElement = document.querySelector(".main");
const seachInput = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body");
const closeModal = document.querySelector(".close-modal");
let watchlist =
  JSON.parse(
    localStorage.getItem("watchlist")
  ) || [];

let movies = [];
let searchValue = "";
let ratings = 0;
let genre = "";

const URL = "./movies-250.json";

async function getMovies() {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    console.log("DATA:", data);
    console.log("IS ARRAY:", Array.isArray(data));

    movies = data.movies;

    populateGenres();
    createMovieCard(movies);

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

function createElement(element) {
  return document.createElement(element);
}

function openMovieModal(movie) {

  modalBody.innerHTML = `
  
    <div class="movie-modal">

      <img src="${movie.Poster}" />

      <div>

        <h2>${movie.Title}</h2>

        <p><strong>IMDb:</strong> ${movie.imdbRating}</p>

        <p><strong>Year:</strong> ${movie.Year}</p>

        <p><strong>Director:</strong> ${movie.Director}</p>

        <p><strong>Actors:</strong> ${movie.Actors}</p>

        <p><strong>Awards:</strong> ${movie.Awards}</p>

        <p>${movie.Plot}</p>
        <div class="modal-actions">
            <button id="fav-btn">❤️ Favorite</button>
            <button id="watch-btn">🎬 Watchlist</button>
            <button id="trailer-btn">▶ Trailer</button>
        </div>

      </div>

    </div>

  `;


    const favBtn =
    document.querySelector("#fav-btn");
    favBtn.addEventListener("click", () => {

    if (!favorites.includes(movie.imdbID)) {

        favorites.push(movie.imdbID);

        localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
        );

        alert("Added to Favorites ❤️");
    }

});

  modal.classList.remove("hidden");
}

function createMovieCard(movieList) {

  parentElement.innerHTML = "";

  movieList.forEach(movie => {

    const cardContainer = createElement("div");
    cardContainer.classList.add("card", "shadow");

    cardContainer.addEventListener("click", () => {
    openMovieModal(movie);
    });

    const imageContainer = createElement("div");
    imageContainer.classList.add("card-image-container");

    const imageEle = createElement("img");
    imageEle.classList.add("card-image");
    imageEle.src = movie.Poster;
    imageEle.alt = movie.Title;

    imageContainer.appendChild(imageEle);

    const cardDetails = createElement("div");
    cardDetails.classList.add("movie-details");

    const title = createElement("p");
    title.classList.add("title");
    title.innerText = movie.Title;

    const genreText = createElement("p");
    genreText.classList.add("genre");
    genreText.innerText = `Genre: ${movie.Genre}`;

    const director = createElement("p");
    director.innerText = `Director: ${movie.Director}`;

    const ratingContainer = createElement("div");
    ratingContainer.classList.add("ratings");

    const starRating = createElement("div");
    starRating.classList.add("star-rating");

    const star = createElement("span");
    star.innerText = "⭐";

    const ratingValue = createElement("span");
    ratingValue.innerText = movie.imdbRating;

    starRating.append(star, ratingValue);

    const runtime = createElement("p");
    runtime.innerText = movie.Runtime;

    ratingContainer.append(starRating, runtime);

    cardDetails.append(
      title,
      genreText,
      director,
      ratingContainer
    );

    cardContainer.append(
      imageContainer,
      cardDetails
    );

    parentElement.appendChild(cardContainer);

    

  });
}

function getFilteredData() {

  return movies.filter(movie => {

    const matchesSearch =
      searchValue === "" ||
      movie.Title.toLowerCase().includes(searchValue) ||
      movie.Director.toLowerCase().includes(searchValue) ||
      movie.Actors.toLowerCase().includes(searchValue);

    const matchesRating =
      ratings === 0 ||
      parseFloat(movie.imdbRating) >= ratings;

    const matchesGenre =
      genre === "" ||
      movie.Genre
        .split(",")
        .map(g => g.trim())
        .includes(genre);

    return (
      matchesSearch &&
      matchesRating &&
      matchesGenre
    );

  });
}

function handleSearch(event) {

  searchValue = event.target.value.toLowerCase();

  createMovieCard(
    getFilteredData()
  );
}

function handleRatingSelector(event) {

  ratings = Number(event.target.value);

  createMovieCard(
    getFilteredData()
  );
}

function handleGenreSelect(event) {

  genre = event.target.value;

  createMovieCard(
    getFilteredData()
  );
}

function debounce(callback, delay) {

  let timerId;

  return (...args) => {

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      callback(...args);
    }, delay);

  };
}

const debounceInput = debounce(
  handleSearch,
  500
);

function populateGenres() {

  const genres = [
    ...new Set(
      movies.flatMap(movie =>
        movie.Genre
          .split(",")
          .map(g => g.trim())
      )
    )
  ].sort();

  genres.forEach(genre => {

    const option = createElement("option");

    option.value = genre;
    option.innerText = genre;

    movieGenres.appendChild(option);

  });
}

seachInput.addEventListener(
  "keyup",
  debounceInput
);

movieRatings.addEventListener(
  "change",
  handleRatingSelector
);

movieGenres.addEventListener(
  "change",
  handleGenreSelect
);

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

getMovies();

