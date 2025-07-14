const moviesContainer = document.getElementById('movies');

fetch('https://ghibliapi.vercel.app/films')
  .then(response => response.json())
  .then(data => {
    data.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie';

      const imageMap = {
        "Spirited Away": "https://www.ghibli.jp/images/chihiro.jpg",
        "My Neighbor Totoro": "https://www.ghibli.jp/images/totoro.jpg",
        "Princess Mononoke": "https://www.ghibli.jp/images/mononoke.jpg",
        "Castle in the Sky": "https://www.ghibli.jp/images/laputa.jpg",
        "Howl's Moving Castle": "https://www.ghibli.jp/images/howl.jpg",
        "Kiki's Delivery Service": "https://www.ghibli.jp/images/majo.jpg",
        "Nausicaä of the Valley of the Wind": "https://www.ghibli.jp/gallery/thumb-nausicaa001.png",
        "The Wind Rises": "https://www.ghibli.jp/images/kazetachinu.jpg",
        "Ponyo": "https://www.ghibli.jp/images/ponyo.jpg",
        "The Tale of the Princess Kaguya": "https://www.ghibli.jp/images/kaguyahime.jpg",
        "When Marnie Was There": "https://www.ghibli.jp/images/marnie.jpg",
        "Arrietty": "https://www.ghibli.jp/images/karigurashi.jpg",
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
        "Tales from Earthsea": "https://www.ghibli.jp/images/ged.jpg",

      };
      
      const imageURL = imageMap[movie.title] || "https://via.placeholder.com/200x300?text=No+Image";

      movieCard.innerHTML = `
        <div>
          <img src="${imageURL}" alt="${movie.title}">
          
        </div>
        <div class="movie-info">
          <p><strong>Original Title:</strong> ${movie.original_title}</p>
          <p><strong>Title:</strong>${movie.title}</p>
          <p><strong>Director:</strong> ${movie.director}</p>
          <p><strong>Producer:</strong> ${movie.producer}</p>
          <p><strong>Release Date:</strong> ${movie.release_date}</p>
          <p><strong>Running Time:</strong> ${movie.running_time} minutes</p>
          <p><strong>Rating Score:</strong> ${movie.rt_score}</p>
          <p><strong>Description:</strong> ${movie.description}</p>
        </div>
      `;

      moviesContainer.appendChild(movieCard);
    });
  })
