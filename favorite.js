const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')



function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`
  })
}


// 監聽 data panel
// 用了非匿名函式的寫法，這是考量日後在為程式除錯時，能夠較快速找到報錯的地方
dataPanel.addEventListener('click',function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function removeFromFavorite (id) {
  if (!movies) return

  console.log('###',movies)

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex( (movie) => movie.id === id)
  if (movieIndex === -1) return

  //刪除該筆電影
  movies.splice(movieIndex, 1)

  //存回 local storage
  localStorage.setItem('favoriteMovies',JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)
  
}

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
  // title, image
    rawHTML += `<div class="col-sm-3">
        <!-- 範本把mb-2獨立成一個div放在這裡，待確認有什麼差別 -->
        <div class="card mb-2">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">
              More</button>
            <button class="btn btn-danger btn-remove-favorite " data-id="${item.id}">X</button>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}

renderMovieList(movies)

