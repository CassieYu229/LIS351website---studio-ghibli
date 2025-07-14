

class FlipCard {
  constructor(frontContent, backContent) {
    this.frontContent = frontContent;
    this.backContent = backContent;
  }

  render(containerId) {
    const container = document.getElementById(containerId);

    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'flip-card';

    cardWrapper.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          ${this.frontContent}
        </div>
        <div class="flip-card-back">
          ${this.backContent}
        </div>
      </div>
    `;

    container.appendChild(cardWrapper);
  }
}

// 🖼️ Character image mapping
const characterImages = {

};

const charactersContainer = document.getElementById('characters');
const movieSelect = document.getElementById('movieSelect');

let allCharacters = [];
let allFilms = {};

// Step 1: Fetch all films and populate dropdown
fetch('https://ghibliapi.vercel.app/films')
  .then(res => res.json())
  .then(films => {
    films.forEach(film => {
      allFilms[film.url] = film.title;

      const option = document.createElement('option');
      option.value = film.url;
      option.textContent = film.title;
      movieSelect.appendChild(option);
    });

    fetchCharacters(); // Load characters after films
  });

// Step 2: Fetch characters
function fetchCharacters() {
  fetch('https://ghibliapi.vercel.app/people')
    .then(res => res.json())
    .then(data => {
      allCharacters = data;
      renderCharacters(data);
    });
}

// Step 3: Filter on dropdown change
movieSelect.addEventListener('change', () => {
  const selected = movieSelect.value;
  if (selected === "all") {
    renderCharacters(allCharacters);
  } else {
    const filtered = allCharacters.filter(char => char.films.includes(selected));
    renderCharacters(filtered);
  }
});

// Step 4: Render flip cards
function renderCharacters(chars) {
  charactersContainer.innerHTML = "";

  if (chars.length === 0) {
    charactersContainer.innerHTML = "<p style='color:white;'>No characters found.</p>";
    return;
  }

  chars.forEach(character => {
    const movieTitles = character.films.map(film => allFilms[film] || "Unknown").join(', ');

    const imgURL = characterImages[character.name] ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(character.name)}&size=250&background=96c1a1&color=ffffff&rounded=true`;

    const front = `
      <h3>${character.name}</h3>
      <img src="${imgURL}" alt="${character.name}" style="border-radius: 10px; width: 200px; height: 250px;">
    `;

    const back = `
      <h4>Gender:</h4><p>${character.gender || "Unknown"}</p>
      <h4>Age:</h4><p>${character.age || "Unknown"}</p>
      <h4>Eye Color:</h4><p>${character.eye_color}</p>
      <h4>Hair Color:</h4><p>${character.hair_color}</p>
      <h4>Movies:</h4><p>${movieTitles}</p>
    `;

    const card = new FlipCard(front, back);
    card.render('characters');
  });
}