import express from 'express'
import Template from './libs/template.js'

const app = express()

const template = ({ title }) => `<h1>${title}</h1>`

const tmplString = new Template('<h1>${title}</h1>')
const tmplFunction = new Template(template)
const tmplFile = Template.loadFile('dynamic')

app.get('/', (_, res) => {
    res.send(tmplString.render({ title: 'Hello world!' }))
})

app.get('/function', (_, res) => {
    res.send(tmplFunction.render({ title: 'Hello world!' }))
})

app.get('/file', (_, res) => {
    res.send(tmplFile.render({ title: 'Hello world!' }))
})

app.listen(3000)