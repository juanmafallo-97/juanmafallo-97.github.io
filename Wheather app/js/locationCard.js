const cardContainer = document.getElementById('card-container')

class locationCard {
    constructor(data) {
        this.removeLocation = this.removeLocation.bind(this)
        this.data = data
        this.name = data.location.name
        this.container = document.createElement('div')
        this.container.classList.add('location-cont')
        this.container.innerHTML = `
        <p class="name">${data.location.name}, ${data.location.country}</p>
        <div class="internal-cont">
        <p class="condition">${data.current.condition.text}</p>
        <div class="icon-container">
                <img src="${data.current.condition.icon}" class="icon">
                <p class="temp">${data.current.temp_c} °C</p>
                </div>
                <p class="secondary">Sensación térmica: ${data.current.feelslike_c} °C</p>
                <p class="secondary">Humedad: ${data.current.humidity} %</p>
                <p class="secondary">Precipitaciones ${data.current.precip_mm} mm</p>
                <p class="secondary">Viento: ${data.current.wind_kph} km/h</p>
                </div>
        <button>Eliminar</button>
                `
        cardContainer.appendChild(this.container)

        this.container.querySelector('button').addEventListener('click', this.removeLocation)
    }

    removeLocation() {
        this.container.remove()
        currentCities.splice
    }
}

export default locationCard