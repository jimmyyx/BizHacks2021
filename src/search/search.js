const KEY = 'AIzaSyD747F8Wq4bALPlpafh3-sU9t3fNtaKT5U'
const CX = 'f013e1116c6108d66'
const Q = 'iPhone 12'

fetch(`https://www.googleapis.com/customsearch/v1?key=${KEY}&cx=${CX}&q=${q}`)
    .then((res) => {
        console.log(res)
    })

// const xhr = new XMLHttpRequest()
// xhr.open('GET', 'https://www.googleapis.com/customsearch/v1?')
// xhr.send(`key=${KEY}&cx=${CX}&q=${Q}`)

