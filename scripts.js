const pedirBtn = document.getElementById('pedir')
const plantarseBtn = document.getElementById('plantarse')
const botonesEleccion = document.querySelector('.elecciones')
const nuevaManoBtn = document.getElementById('nueva-mano')
let dinero = document.getElementById('dineroDisponible')
let dineroApostado = document.getElementById('dinero-apostado')
const dineroApostadoCont = document.querySelector('.dinero-apostado')
const anuncioCont = document.getElementById('mensaje-cont')
const anuncio = document.getElementById('anuncio')
const apuestaForm = document.getElementById('apuesta-form')
const apuestaInput = document.getElementById('apuesta-input')
const apuestaBtn = document.getElementById('confirmar-apuesta')
const mensajeError = document.getElementById('error')

const cartas = ['As-c','_2-c','_3-c','_4-c','_5-c','_6-c','_7-c','_8-c','_9-c','_10-c','J-c','Q-c','K-c','As-d','_2-d','_3-d','_4-d','_5-d','_6-d','_7-d','_8-d','_9-d','_10-d','J-d','Q-d','K-d','As-p','_2-p','_3-p','_4-p','_5-p','_6-p','_7-p','_8-p','_9-p','_10-p','J-p','Q-p','K-p','As-t','_2-t','_3-t','_4-t','_5-t','_6-t','_7-t','_8-t','_9-t','_10-t','J-t','Q-t','K-t',]

const valoresCartasAs1 = {
    As: 1,
    _2: 2,
    _3: 3,
    _4: 4,
    _5: 5,
    _6: 6,
    _7: 7, 
    _8: 8,
    _9: 9,
    _10: 10,
    J: 10,
    Q: 10,
    K: 10
} 

const valoresCartasAs11 = {
    As: 11,
    _2: 2,
    _3: 3,
    _4: 4,
    _5: 5,
    _6: 6,
    _7: 7, 
    _8: 8,
    _9: 9,
    _10: 10,
    J: 10,
    Q: 10,
    K: 10
} 

class Partida {
    constructor() {
        this.mazo = []
        this.dineroJugador = 5000
        this.valorApuesta = 0
        this.manoJugador = []
        this.puntajeJugador = 0
        this.manoPC = []
        this.puntajePC = 0
        this.comenzarMano()
    }

    reiniciarMazo() {
        this.mazo = ['As-c','_2-c','_3-c','_4-c','_5-c','_6-c','_7-c','_8-c','_9-c','_10-c','J-c','Q-c','K-c','As-d','_2-d','_3-d','_4-d','_5-d','_6-d','_7-d','_8-d','_9-d','_10-d','J-d','Q-d','K-d','As-p','_2-p','_3-p','_4-p','_5-p','_6-p','_7-p','_8-p','_9-p','_10-p','J-p','Q-p','K-p','As-t','_2-t','_3-t','_4-t','_5-t','_6-t','_7-t','_8-t','_9-t','_10-t','J-t','Q-t','K-t',]
    }

    reiniciarValores(empate){
        if(!empate) {
            this.valorApuesta = 0
            dineroApostado.textContent = ''
        }
        this.ocultarCartas()
        this.reiniciarMazo()
        dineroApostadoCont.style.display = 'none' 
        anuncioCont.style.display = 'none'
        anuncio.textContent = ''
        this.manoJugador = []
        this.puntajeJugador = 0
        this.manoPC = []
        this.puntajePC = 0
        nuevaManoBtn.removeEventListener('click', this.comenzarMano)
        nuevaManoBtn.style.display = 'none'
    }

    comenzarMano(empate) {
        this.reiniciarValores(empate)
        this.apuesta()
            .then(response => {
                dineroApostado.textContent = Number(dineroApostado.textContent) + response
                this.valorApuesta += response
                return response
            })
            .then(response => {
                this.dineroJugador -= response
                dinero.textContent = this.dineroJugador
            })
            .then(() => apuestaForm.style.display = 'none')
            .then(() => this.repartirCartas())
    }

    apuesta() {
        apuestaForm.style.display = 'flex'
        let promise = new Promise((resolve) => {
            apuestaBtn.onclick = () => {
                let valorApostado = Number(apuestaInput.value)
                if(valorApostado <= this.dineroJugador && valorApostado && typeof(Number(valorApostado)) == 'number') {
                    apuestaInput.value = ''
                    mensajeError.style.display = 'none'
                    resolve(valorApostado)
                } else mensajeError.style.display = 'inline-block'
            }
        })
        return promise
    }
    
    async mensajeTemporal(mensaje) {
        anuncioCont.style.display = 'flex'
        anuncio.textContent = mensaje
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 1500)
        })
        await promise
        anuncio.textContent = ''
        anuncioCont.style.display = 'none'
    }

    async repartirCartas() {
        dineroApostadoCont.style.display = 'flex' 
        await this.mensajeTemporal('Repartiendo...')
        this.repartirPC()
        this.repartirJugador()
        this.jugarTurno()
    }

    repartirPC() {
        this.manoPC.push(this.sacarCarta())
        this.puntajePC = this.contarPuntos(this.manoPC)
        this.mostrarManoPC()
    }
    
    repartirJugador() {
        this.manoJugador.push(this.sacarCarta())
        this.mostrarManoJugador()
        this.puntajeJugador = this.contarPuntos(this.manoJugador)
        this.controlarResultadoJugador()
    }
    
    sacarCarta() {
        let carta = String(this.mazo.splice(Math.floor(Math.random() * this.mazo.length), 1))
        return carta
    }

    jugarTurno() {
        botonesEleccion.style.display = 'flex'
        this.repartirJugador = this.repartirJugador.bind(this)
        this.sePlanta = this.sePlanta.bind(this)
        pedirBtn.addEventListener('click', this.repartirJugador)
        plantarseBtn.addEventListener('click', this.sePlanta)
    }
    
    terminarTurno() {
        pedirBtn.removeEventListener('click', this.repartirJugador)
        plantarseBtn.removeEventListener('click', this.sePlanta)
    }
    
    sePlanta() {
        this.terminarTurno()
        this.juegaPc()
    }
    
    juegaPc() {
        this.repartirPC()
        if (this.puntajePC < 17) {
            return this.juegaPc()
        }
        this.controlarResultadoPC()
    }

    PCtieneAs() {
        if (this.manoPC.some(carta => carta.includes('As')))
        return true
    }

    contarPuntos(mano) {
        let puntos = this.pasarCartasAPuntos11(mano)
        if (puntos > 21){
            puntos = this.pasarCartasAPuntos1(mano)
        }
        return puntos
    }
    
    async controlarResultadoJugador() {
        if (this.manoJugador.length === 2 && this.puntajeJugador === 21){
            anuncio.textContent = "Blackjack!!"
            this.terminarTurno()
            this.ganaConBlackjack()
        } else if (this.puntajeJugador === 21){
            await this.mensajeTemporal('21! Esperemos a la banca')
            this.terminarTurno()
            this.juegaPc()
        } else if (this.puntajeJugador > 21){
            anuncio.textContent = "Se pasó de 21... Gana la banca"
            this.terminarTurno()
            this.pierdeJugador()
        }
    }
    
    controlarResultadoPC() {
        if (this.manoPC.length === 2 && this.puntajePC === 21){
            anuncio.textContent = "Blackjack para la Banca!!"
            this.pierdeJugador()
        } else if (this.puntajePC === 21){
            if (this.puntajeJugador === 21) {
                anuncio.textContent = "Empate!!"
                this.empate()
            } else {
                anuncio.textContent = "Gana la banca con 21"
                this.pierdeJugador()
            }
        } else if (this.puntajePC > 21){
            anuncio.textContent = "La banca se pasa, gana usted"
            this.terminarTurno()
            this.ganaJugador()
        } else {
            if (this.puntajeJugador === this.puntajePC) {
                anuncio.textContent = "Empate!!"
                this.empate()
            } else if (this.puntajePC < this.puntajeJugador) {
                anuncio.textContent = `Gana usted, ${this.puntajeJugador} contra ${this.puntajePC}`
                this.ganaJugador()
            } else {
                anuncio.textContent = `Gana la banca, ${this.puntajePC} contra ${this.puntajeJugador}`
                this.pierdeJugador()
            }
        }
        anuncioCont.style.display = 'flex'
    }
    
    mostrarManoJugador() {
        let mano = this.manoJugador
        for (let carta of mano) {
            document.getElementById(carta).style.display = 'inline-block'
        }
    }
    
    mostrarManoPC() {
        let mano = this.manoPC
        for (let carta of mano) {
            document.getElementById(`b${carta}`).style.display = 'inline-block'
        }
    }
    
    ganaConBlackjack() {
        this.dineroJugador += this.valorApuesta * 3
        dinero.textContent = this.dineroJugador
        this.finalizarMano()
    }

    ganaJugador() {
        this.dineroJugador += this.valorApuesta * 2 
        dinero.textContent = this.dineroJugador
        this.finalizarMano()
    }

    pierdeJugador() {
        this.finalizarMano()
    }

    empate() {
        this.finalizarMano(true)
    }
    
    ocultarCartas() {
        let manoPC = this.manoPC
        let manoJugador = this.manoJugador
        for (let carta of manoJugador) {
            document.getElementById(`${carta}`).style.display = 'none'
        }
        for (let carta of manoPC) {
            document.getElementById(`b${carta}`).style.display = 'none'
        }
        return
    }

    finalizarMano(empate = false) {
        botonesEleccion.style.display = 'none'
        anuncioCont.style.display = 'flex'
        this.comenzarMano = this.comenzarMano.bind(this)
        nuevaManoBtn.style.display = 'flex'
        nuevaManoBtn.addEventListener('click', () => this.comenzarMano(empate))
    }

    pasarCartasAPuntos1(mano) {
        let arrayDePuntos = []
        for (let carta of mano) {
            arrayDePuntos.push(valoresCartasAs1[carta.split('-')[0]])
        }
        return arrayDePuntos.reduce((a,b) => a+b)
    }
    
    pasarCartasAPuntos11(mano) {
        let arrayDePuntos = []
        for (let carta of mano) {
            arrayDePuntos.push(valoresCartasAs11[carta.split('-')[0]])
        }
        return arrayDePuntos.reduce((a,b) => a+b)
    }

}

window.partida = new Partida()

