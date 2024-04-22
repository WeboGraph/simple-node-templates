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

// more complex example
const people = [
    {
        firstname: 'John',
        lastname: 'Doe',
        age: 21,
    },
    {
        firstname: 'Max',
        lastname: 'Mustermann',
        age: 30,
    },
]
const page = Template.loadFile('complex')
const list = Template.loadFile('partials/list')
const listitem = Template.loadFile('partials/list-item')

app.get('/complex', (_, res) => {
    const items = []

    for (const p of people) {
        items.push(listitem.render(p))
    }

    const content = list.render({ items: items.join('') })
    const html = page.render({ title: 'Peoples list', content })

    res.send(html)
})

app.listen(3000)