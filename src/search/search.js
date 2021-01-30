const KEY = 'AIzaSyD747F8Wq4bALPlpafh3-sU9t3fNtaKT5U'
const CX = 'f013e1116c6108d66'
const Q = 'Samsung Galaxy S21 is good'

const init = {
    method: 'GET',
}

fetch(`https://www.googleapis.com/customsearch/v1?key=${KEY}&cx=${CX}&q=${Q}&num=1`, init)
    .then(res => new Response(res.body).json())
    .then(res => {
        console.log(res.items)

        return res.items[0].link
    })