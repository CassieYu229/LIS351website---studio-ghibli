const charactersContainer = document.getElementById("characters");
const movieSelect = document.getElementById("movieSelect");
const characterSearchInput = document.getElementById("characterSearch");
const characterCount = document.getElementById("characterCount");

if (charactersContainer && movieSelect && characterSearchInput && characterCount) {
  let allCharacters = [];
  let allFilms = {};
  const characterImageCache = new Map();

  const characterWikiTitles = {
    "Lusheeta Toel Ul Laputa": "Sheeta",
    "Captain Dola": "Dola",
    "Romska Palo Ul Laputa": "Muska",
    "Colonel Muska": "Muska",
    "Renaldo Moon aka Moon aka Muta": "Muta",
    "Baron Humbert von Gikkingen": "Baron",
    "Chu Totoro": "Chuu Totoro"
  };

  const setLoadingState = (message) => {
    charactersContainer.innerHTML = `<div class="section-card loading-state">${message}</div>`;
    characterCount.textContent = message;
  };

  const updateCount = (count) => {
    characterCount.textContent = count === 1 ? "1 character shown" : `${count} characters shown`;
  };

  const createDetail = (label, value) => {
    const detail = document.createElement("div");
    detail.className = "character-detail";

    const detailLabel = document.createElement("span");
    detailLabel.className = "character-detail-label";
    detailLabel.textContent = label;

    const detailValue = document.createElement("span");
    detailValue.className = "character-detail-value";
    detailValue.textContent = value;

    detail.append(detailLabel, detailValue);
    return detail;
  };

  const chunkArray = (items, size) => {
    const chunks = [];

    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }

    return chunks;
  };

  const getWikiLookupTitle = (name) => characterWikiTitles[name] || name;

  const getFallbackImage = (character) => {
    const firstFilmUrl = character.films && character.films.length ? character.films[0] : null;
    const film = firstFilmUrl ? allFilms[firstFilmUrl] : null;

    if (film && film.image) {
      return film.image;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(character.name)}&size=420&background=6f9476&color=fff8f0&rounded=true&bold=true`;
  };

  const getCharacterImage = (character) => {
    const cacheKey = getWikiLookupTitle(character.name).toLowerCase();
    return characterImageCache.get(cacheKey) || getFallbackImage(character);
  };

  const loadCharacterImages = async (characters) => {
    const lookupTitles = [...new Set(characters.map((character) => getWikiLookupTitle(character.name)))];
    const batches = chunkArray(lookupTitles, 20);

    await Promise.all(
      batches.map(async (batch) => {
        const response = await fetch(
          `https://ghibli.fandom.com/api.php?action=query&prop=pageimages&format=json&pithumbsize=500&origin=*&titles=${encodeURIComponent(batch.join("|"))}`
        );

        if (!response.ok) {
          throw new Error("Unable to load character images.");
        }

        const data = await response.json();
        const pages = data?.query?.pages || {};

        Object.values(pages).forEach((page) => {
          if (page?.title && page?.thumbnail?.source) {
            characterImageCache.set(page.title.toLowerCase(), page.thumbnail.source);
          }
        });
      })
    );
  };

  const renderCharacters = (characters) => {
    charactersContainer.innerHTML = "";

    if (!characters.length) {
      charactersContainer.innerHTML =
        '<div class="section-card empty-state">No characters match the current filters yet. Try a different movie or search term.</div>';
      updateCount(0);
      return;
    }

    const fragment = document.createDocumentFragment();

    characters.forEach((character) => {
      const card = document.createElement("article");
      card.className = "character-card";
      card.setAttribute("data-reveal", "");

      const image = document.createElement("img");
      image.className = "character-avatar";
      image.src = getCharacterImage(character);
      image.alt = `${character.name} image`;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.src = getFallbackImage(character);
      });

      const name = document.createElement("h2");
      name.textContent = character.name;

      const detailGrid = document.createElement("div");
      detailGrid.className = "character-detail-grid";
      detailGrid.append(
        createDetail("Gender", character.gender || "Unknown"),
        createDetail("Age", character.age || "Unknown"),
        createDetail("Eye color", character.eye_color || "Unknown"),
        createDetail("Hair color", character.hair_color || "Unknown")
      );

      const filmList = document.createElement("div");
      filmList.className = "character-films";

      const filmTitles = character.films.length
        ? character.films.map((filmUrl) => allFilms[filmUrl]?.title || "Unknown film")
        : ["Unknown film"];

      filmTitles.forEach((filmTitle) => {
        const pill = document.createElement("span");
        pill.className = "character-film-pill";
        pill.textContent = filmTitle;
        filmList.appendChild(pill);
      });

      card.append(image, name, detailGrid, filmList);
      fragment.appendChild(card);
    });

    charactersContainer.appendChild(fragment);
    updateCount(characters.length);

    if (typeof window.registerReveal === "function") {
      window.registerReveal(charactersContainer);
    }
  };

  const applyFilters = () => {
    const selectedMovie = movieSelect.value;
    const query = characterSearchInput.value.trim().toLowerCase();

    const filtered = allCharacters.filter((character) => {
      const matchesMovie =
        selectedMovie === "all" || (character.films && character.films.includes(selectedMovie));
      const matchesSearch = character.name.toLowerCase().includes(query);

      return matchesMovie && matchesSearch;
    });

    renderCharacters(filtered);
  };

  setLoadingState("Loading characters...");

  fetch("https://ghibliapi.vercel.app/films")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load film metadata.");
      }
      return response.json();
    })
    .then((films) => {
      films
        .sort((a, b) => a.title.localeCompare(b.title))
        .forEach((film) => {
          allFilms[film.url] = {
            title: film.title,
            image: film.image,
            movieBanner: film.movie_banner
          };

          const option = document.createElement("option");
          option.value = film.url;
          option.textContent = film.title;
          movieSelect.appendChild(option);
        });

      return fetch("https://ghibliapi.vercel.app/people");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load characters.");
      }
      return response.json();
    })
    .then((characters) => {
      allCharacters = characters.sort((a, b) => a.name.localeCompare(b.name));
      return loadCharacterImages(allCharacters)
        .catch(() => {
          // If wiki thumbnails fail, we still render every character with film art or generated fallback.
        })
        .then(() => {
          renderCharacters(allCharacters);
        });
    })
    .catch(() => {
      charactersContainer.innerHTML =
        '<div class="section-card empty-state">The character list could not load right now. Please try again later.</div>';
      characterCount.textContent = "Character list unavailable";
    });

  movieSelect.addEventListener("change", applyFilters);
  characterSearchInput.addEventListener("input", applyFilters);
}
