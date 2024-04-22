import { readFileSync } from 'node:fs'

export default class Template {
    constructor(template) {
        if ('function' === typeof template) {
            this.tmpl = template
            return
        }

        this.#parseTemplate(template)
    }

    #parseTemplate(templateString) {
        const args = `{${Object.keys({ title: 'name' }).join(',')}}`
        const body = 'return `' + templateString + '`'
        this.tmpl = (data) => new Function(args, body)(data)
    }

    static loadFile(name) {
        const templateString = readFileSync(import.meta.dirname + '/../../tmpl/' + name + '.html');
        return new Template(templateString);
    }

    render(data) {
        return this.tmpl(data)
    }
}
