const h1 = document.querySelector('h1')
const siteNav = document.querySelector('.site__nav')
const mainContainer = document.querySelector('.main__container')

const baseURL = 'https://swapi.dev/api/'

let currentEndPoint = ''

window.addEventListener('DOMContentLoaded', (e) => {
  fetch(baseURL)
    .then((res) => res.json())
    .then((data) => {
      for (const section in data) {
        // console.log(`${section} : ${data[section]}`)
        const sectionBtn = document.createElement('button')
        sectionBtn.classList.add('site__nav-button')
        sectionBtn.textContent = `${section}`
        siteNav.append(sectionBtn)
        sectionBtn.sectionURL = data[section]
        sectionBtn.addEventListener('click', getContent)
      }
    })
})

const getContent = (e) => {
  const btn = e.target
  // console.log(btn.sectionURL)
  getJSON(btn.sectionURL)
}

const getJSON = (url) => {
  currentEndPoint = url
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      displaySection(data)
    })
}

const displaySection = (data) => {
  console.log(data)
  mainContainer.innerHTML = currentEndPoint
  data.results.forEach((thing) => {
    const div = document.createElement('div')
    div.classList.add('main__container-item')
    div.textContent = thing.name || thing.title

    div.itemURL = thing.url
    div.addEventListener('click', displayItem)

    mainContainer.append(div)
    //console.log(thing.name)
  })

  // Handle Section Pagination
  const paginationContainer = document.createElement('div')
  paginationContainer.classList.add('pagination__container')
  mainContainer.append(paginationContainer)

  if (data.previous) {
    const previousPageBtn = document.createElement('button')
    previousPageBtn.textContent = 'Previous'
    paginationContainer.append(previousPageBtn)
    previousPageBtn.sectionURL = data.previous
    // previousPageBtn.addEventListener('click', getJSON)
    previousPageBtn.addEventListener('click', (e) => {
      // console.log(data.previous)
      getJSON(data.previous)
    })
  }

  if (data.next) {
    const nextPageBtn = document.createElement('button')
    nextPageBtn.textContent = 'Next'
    paginationContainer.append(nextPageBtn)
    nextPageBtn.sectionURL = data.next
    // nextPageBtn.addEventListener('click', getJSON)
    nextPageBtn.addEventListener('click', (e) => {
      // console.log(data.next)
      getJSON(data.next)
    })
  }

  // Get page number buttons
  const total = Math.ceil(data.count / 10)

  for (let i = 0; i < total; i++) {
    const numberedPageBtn = document.createElement('button')
    numberedPageBtn.classList.add('pagination__btn')
    numberedPageBtn.textContent = i + 1
    paginationContainer.append(numberedPageBtn)
    // numberedPageBtn.addEventListener('click', getJSON)
    let cleanURL = currentEndPoint.split('?')
    let numberedPageBtnURL = `${cleanURL[0]}?page=${i + 1}`
    numberedPageBtn.sectionURL = numberedPageBtnURL
    console.log(cleanURL)
    numberedPageBtn.addEventListener('click', (e) => {
      console.log(numberedPageBtnURL)
      getJSON(numberedPageBtnURL)
    })
  }
}

const displayItem = (e) => {
  const item = e.target
  //console.log(item.itemURL)
  mainContainer.innerHTML = ''
  fetch(item.itemURL)
    .then((res) => res.json())
    .then((itemData) => {
      // console.log(itemData)
      for (const property in itemData) {
        //console.log(`${property}: ${itemData[property]}`)
        //console.log(typeof itemData[property])

        let html = typeof itemData[property] == 'string' ? itemData[property] : JSON.stringify(itemData[property])
        mainContainer.innerHTML += `<div class="${property}"><span class="label">${property}:</span> ${html}</div>`
      }
    })
    .catch((err) => {
      mainContainer.innerHTML = 'Error... '
      console.log(err)
    })
}
