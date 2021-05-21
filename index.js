const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


axios 
.get(INDEX_URL)
.then ( (response) => {
 movies.push(... response.data.results)  //用...展開運算子，把陣列元素展開
 renderPaginator(movies.length)
 renderMovieList(getMoviesByPage(1))
})
.catch ( (err) => console.log(err))


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

function addToFavorite(id) {
  //
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }



  list.push(movie)
  localStorage.setItem('favoriteMovies',JSON.stringify(list))
}

// 監聽 data panel
// 用了非匿名函式的寫法，這是考量日後在為程式除錯時，能夠較快速找到報錯的地方
dataPanel.addEventListener('click',function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
  
    addToFavorite(Number(event.target.dataset.id))
  }
})

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
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}



searchForm.addEventListener('submit', function onSearchFormSubmitted (event) {
  event.preventDefault() //請瀏覽器終止元件的預設行為，把控制權交給 JavaScript
  const keyword = searchInput.value.trim().toLowerCase()
  searchInput.value = ""
  

  //取得篩選後的清單，方法一 for of
  // for ( const movie of movies) {
  //   if ( movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   } 
  // }


 //取得篩選後的清單，方法二 .filter()
 filteredMovies = movies.filter ( (movie) => 
   movie.title.toLowerCase().includes(keyword)
 )
   
   //錯誤處理
  if ( filteredMovies.length === 0){
    return alert (`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    
  }

 //重製分頁器
 renderPaginator(filteredMovies.length)
 //預設顯示第 1 頁的搜尋結果
  renderMovieList(getMoviesByPage(1))

})

function getMoviesByPage(page) {
   //設定是資料來源
   const data = filteredMovies.length ? filteredMovies : movies

  //計算起始 index 
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  //回傳切割後的新陣列
  return data.slice( startIndex, startIndex + MOVIES_PER_PAGE)
}


paginator.addEventListener('click', (event) => {
 //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
//透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
//更新畫面
renderMovieList(getMoviesByPage(page))

} )

function renderPaginator (amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for ( let page = 1; page <= numberOfPages ; page++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
    paginator.innerHTML = rawHTML
}

  // if ( !keyword.length) {
  //   alert('Wrong!')
  // }
