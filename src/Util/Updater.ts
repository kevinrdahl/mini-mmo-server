export default class Updater {
    private intervalMS?:number
    private callback?:(delta:number)=>void

    lastUpdate:number = 0
    nextUpdate:number = 0
    running = false
    timeout?:NodeJS.Timeout

    start(intervalMS:number, callback:(delta:number)=>void) {
        if (this.running) return
        this.intervalMS = intervalMS
        this.callback = callback

        this.lastUpdate = Date.now()
        this.nextUpdate = this.lastUpdate + this.intervalMS
        this.running = true
        this.setTick()
    }

    stop() {
        if (!this.running) return
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = undefined
        }
        this.running = false
    }

    setTick() {
        const delay = Math.max(10, this.nextUpdate - Date.now())
        this.timeout = setTimeout(this.tick, delay)
    }

    tick = () => {
        if (!this.intervalMS || !this.callback) return

        const now = Date.now()
        const delta = (now - this.lastUpdate) / 1000
        this.lastUpdate = now
        this.nextUpdate += this.intervalMS
        this.callback(delta)
        this.setTick()
    }
}