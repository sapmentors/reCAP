class TextScramble {
    constructor(el) {
        this.el = el
        this.chars = "!<>-_\\/[]{}—=+*^?#________"
        this.update = this.update.bind(this)
    }
    setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => (this.resolve = resolve))
        this.queue = []
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ""
            const to = newText[i] || ""
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }
    update() {
        let output = ""
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar()
                    this.queue[i].char = char
                }
                output += `<span class="dud">${char}</span>`
            } else {
                output += from
            }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/base/security/URLListValidator",
        "sap/ui/core/ComponentSupport",
    ],
    (Controller, JSONModel, URLListValidator, Fragment) => {
        return Controller.extend("recap.App", {
            onInit() {
                const viewStates = new JSONModel({
                    plannerBusy: true,
                    landscape: sap.ui.Device.orientation.landscape,
                })
                this.getView().setModel(viewStates, "view")
                sap.ui.Device.orientation.attachHandler((oEvent) => {
                    this.getView()
                        .getModel("view")
                        .setProperty("/landscape", oEvent.landscape)
                })

                URLListValidator.add("mailto")
                URLListValidator.add("https")
                URLListValidator.add("data")
                const oModel = new JSONModel({
                    where: `<p>📍&nbsp;&nbsp;<a href="https://maps.app.goo.gl/KsB42AK1DwNznLMJA">ROT 03</a></p>
                    <p>🏛️ <code>on-{site,line}</code> 🎦</p>`,
                    what: `<div class="announce">
		<h2>June&nbsp;4</h2>
		<h2>June&nbsp;4</h2>
	</div>`
                })
                this.getView().setModel(oModel)

            }
        })
    }
)
