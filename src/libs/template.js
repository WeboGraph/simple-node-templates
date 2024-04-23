import { readFileSync } from 'node:fs'

export default class Template {
    constructor(template) {
        if ('function' === typeof template) {
            this.render = template
            return
        }

        this.#parseTemplate(template)
    }

    #parseTemplate(tmplStr) {
        const parseArgs = (data) => `{${Object.keys(data).join(',')}}`
        const body = 'return `' + tmplStr + '`'
        this.render = (data) => new Function(parseArgs(data), body)(data)
    }

    /**
     * @param { string } name The name corresponds to the filepath in the tmpl directory.
     * @param { boolean } multi True if the file contains multiple templates.
     * @returns { Template | Object.<String, Template> }
     */
    static loadFile(name, multi = false) {
        name = name.endsWith('.html') ? name : name + '.html'
        const content = readFileSync(import.meta.dirname + '/../../tmpl/' + name, 'utf-8')

        if (true !== multi) {
            return new Template(content)
        }

        return extractTemplates(content)
    }
}

/**
 * Extracts the block templates from file content
 * @param { string } content
 * @returns { Object.<string, Template> } Templates Object
 */
function extractTemplates(content) {
    const endRegexp = /^{{\s*end\s*}}$/gm
    const blockRegexp = /^{{\s*block\s+([0-9,a-z,A-Z,\-,\_]+)\s*}}$/gmi
    const templates = {}
    const blocks = content.trim().split(endRegexp).map(b => b.trim())

    for (const block of blocks) {
        if (0 >= block.length || true !== blockRegexp.test(block)) {
            continue
        }
        const [tag] = block.match(blockRegexp)
        const [_, name] = tag.replace(/[{,}]/gi, '').trim().split(/\s/gm)
        const tmpl = block.replace(blockRegexp, '')

        if (name && tmpl) {
            templates[name] = new Template(tmpl)
        }
    }

    return templates
}
