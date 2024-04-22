import express from 'express'
import Template from './libs/template.js'

const app = express()

const tmplString = new Template('<h1>${title}</h1>')
const tmplFunction = new Template(({ title }) => `<h1>${title}</h1>`)
const tmplFile = Template.loadFile('dynamic')

app.get('/', (_, res) => {
    const html = tmplString.render({ title: 'Hello world!' })
    res.send(html)
})

app.get('/file', (_, res) => {
    const html = tmplFile.render({ title: 'Hello world!' })
    res.send(html)
})

app.get('/function', (_, res) => {
    const html = tmplFunction.render({ title: 'Hello world!' })
    res.send(html)
})

app.listen(3000)