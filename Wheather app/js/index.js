import locationCard from './locationCard.js'

const keyForm = document.getElementById('key-form')
const keyInput = document.getElementById('key-input')
const locationForm = document.getElementById('location-form')
const locationInput = document.getElementById('location-input')
const submitBtn = document.getElementById('submit-btn')
const errorContainer = document.getElementById('error-container')
let API_KEY 
const baseURl = 'http://api.weatherapi.com/v1'

const currentCities = []

locationInput.disabled = true
submitBtn.disabled = true

async function fetchData(type, input) {
    const url = `${baseURl}/${type}.json?key=${API_KEY}&q=${input}&lang=es`
    try {
        const data = await fetch(url)
        const jsonData = await data.json()
        return jsonData
    } catch(error) {
        console.error(error)
    }
}

function createLocationCard(data) {
    if (data.error) {
        if(data.error.code === 1006) errorContainer.textContent = 'No se encontró la ubicación'
        else if(data.error.code === 2006 === 1002) errorContainer.textContent = 'La API Key no es válida'
        else errorContainer.textContent = data.error.message
        errorContainer.classList.remove('hide')
    } 
    else {
        if(currentCities.some(location => location.name === data.location.name)) return
        currentCities.push(new locationCard(data))
        errorContainer.textContent = ''
        errorContainer.classList.add('hide')
    }
}

async function validateKey() {
    const response = await fetchData('current', 'london')
    if(!response.error) {
        errorContainer.textContent = ''
        errorContainer.classList.add('hide')
        submitBtn.disabled = false
        locationInput.disabled = false
        locationForm.classList.remove('hide')
    } else {
        if(response.error.code === 2006 || response.error.code === 1002) {
            errorContainer.textContent = 'La API Key no es válida'}
        else {errorContainer.textContent = response.error.message}
        console.error(response.error)
        locationForm.classList.add('hide')
        errorContainer.classList.remove('hide')
    }
}

locationForm.addEventListener('submit', async e => {
    e.preventDefault()
    if(locationInput.value.length === 0) return
    const locationData = await fetchData('current', locationInput.value)
    console.log(locationData)
    createLocationCard(locationData)
})

keyForm.addEventListener('submit', e => {
    e.preventDefault()
    API_KEY = keyInput.value
    validateKey()
})




