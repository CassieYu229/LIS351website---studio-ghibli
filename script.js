const moviesContainer = document.getElementById("movies");
const movieSearchInput = document.getElementById("movieSearch");
const movieCount = document.getElementById("movieCount");

if (moviesContainer && movieSearchInput && movieCount) {
  const imageMap = {
    "Spirited Away": "https://www.ghibli.jp/images/chihiro.jpg",
    "My Neighbor Totoro": "https://www.ghibli.jp/images/totoro.jpg",
    "Princess Mononoke": "https://www.ghibli.jp/images/mononoke.jpg",
    "Castle in the Sky": "https://www.ghibli.jp/images/laputa.jpg",
    "Howl's Moving Castle": "https://www.ghibli.jp/images/howl.jpg",
    "Kiki's Delivery Service": "https://www.ghibli.jp/images/majo.jpg",
    "Nausica\u00E4 of the Valley of the Wind": "https://www.ghibli.jp/gallery/thumb-nausicaa001.png",
    "The Wind Rises": "https://www.ghibli.jp/images/kazetachinu.jpg",
    Ponyo: "https://www.ghibli.jp/images/ponyo.jpg",
    "The Tale of the Princess Kaguya": "https://www.ghibli.jp/images/kaguyahime.jpg",
    "When Marnie Was There": "https://www.ghibli.jp/images/marnie.jpg",
    Arrietty: "https://www.ghibli.jp/images/karigurashi.jpg",
    "From Up on Poppy Hill": "https://www.ghibli.jp/images/kokurikozaka.jpg",
    "The Cat Returns": "https://www.ghibli.jp/images/baron.jpg",
    "Whisper of the Heart": "https://www.ghibli.jp/images/mimi.jpg",
    "The Red Turtle": "https://www.ghibli.jp/images/red-turtle.jpg",
    "Earwig and the Witch": "https://www.ghibli.jp/images/aya.jpg",
    "Grave of the Fireflies": "https://www.ghibli.jp/images/hotarunohaka.jpg",
    "My Neighbors the Yamadas": "https://www.ghibli.jp/images/yamada.jpg",
    "Only Yesterday": "https://www.ghibli.jp/images/omoide.jpg",
    "Porco Rosso": "https://www.ghibli.jp/images/porco.jpg",
    "Pom Poko": "https://www.ghibli.jp/images/tanuki.jpg",
    "Tales from Earthsea": "https://www.ghibli.jp/images/ged.jpg"
  };

  let allMovies = [];

  const setLoadingState = (message) => {
    moviesContainer.innerHTML = `<div class="section-card loading-state">${message}</div>`;
    movieCount.textContent = message;
  };

  const updateCount = (count) => {
    movieCount.textContent = count === 1 ? "1 film shown" : `${count} films shown`;
  };

  const createDetail = (label, value) => {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;

    wrapper.append(term, description);
    return wrapper;
  };

  const renderMovies = (movies) => {
    moviesContainer.innerHTML = "";

    if (!movies.length) {
      moviesContainer.innerHTML =
        '<div class="section-card empty-state">No films match that search yet. Try a different title, year, or creator.</div>';
      updateCount(0);
      return;
    }

    const fragment = document.createDocumentFragment();

    movies.forEach((movie) => {
      const card = document.createElement("article");
      card.className = "movie-card";
      card.setAttribute("data-reveal", "");

      const poster = document.createElement("img");
      poster.className = "movie-poster";
      poster.src = imageMap[movie.title] || "https://via.placeholder.com/600x750?text=Studio+Ghibli";
      poster.alt = `${movie.title} poster`;
      poster.loading = "lazy";

      const header = document.createElement("div");
      header.className = "movie-card-header";

      const title = document.createElement("h2");
      title.textContent = movie.title;

      const subtitle = document.createElement("p");
      subtitle.className = "movie-subtitle";
      subtitle.textContent = movie.original_title || "Original title unavailable";

      const badges = document.createElement("div");
      badges.className = "movie-badges";

      const runtimeBadge = document.createElement("span");
      runtimeBadge.className = "movie-badge";
      runtimeBadge.textContent = `${movie.running_time} min`;

      const scoreBadge = document.createElement("span");
      scoreBadge.className = "movie-badge";
      scoreBadge.textContent = `RT ${movie.rt_score}`;

      badges.append(runtimeBadge, scoreBadge);
      header.append(title, subtitle, badges);

      const details = document.createElement("dl");
      details.className = "movie-details";
      details.append(
        createDetail("Director", movie.director || "Unknown"),
        createDetail("Producer", movie.producer || "Unknown"),
        createDetail("Release year", movie.release_date || "Unknown"),
        createDetail("Original title", movie.original_title_romanised || movie.original_title || "Unknown")
      );

      const description = document.createElement("p");
      description.className = "movie-description";
      description.textContent = movie.description || "No description available.";

      card.append(poster, header, details, description);
      fragment.appendChild(card);
    });

    moviesContainer.appendChild(fragment);
    updateCount(movies.length);

    if (typeof window.registerReveal === "function") {
      window.registerReveal(moviesContainer);
    }
  };

  const filterMovies = () => {
    const query = movieSearchInput.value.trim().toLowerCase();

    const filtered = allMovies.filter((movie) => {
      const searchableText = [
        movie.title,
        movie.original_title,
        movie.original_title_romanised,
        movie.director,
        movie.producer,
        movie.release_date
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    renderMovies(filtered);
  };

  setLoadingState("Loading films...");

  fetch("https://ghibliapi.vercel.app/films")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load films right now.");
      }
      return response.json();
    })
    .then((data) => {
      allMovies = [...data].sort((a, b) => Number(a.release_date) - Number(b.release_date));
      renderMovies(allMovies);
    })
    .catch(() => {
      moviesContainer.innerHTML =
        '<div class="section-card empty-state">The movie list could not load right now. Please try again later.</div>';
      movieCount.textContent = "Film list unavailable";
    });

  movieSearchInput.addEventListener("input", filterMovies);
}
