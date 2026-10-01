// Fills every key that is missing in a language file (compared with en.js) by machine translation.
// Hand-written translations are never touched. Run after adding new English texts:
//   npm run i18n:fill            (all languages)
//   npm run i18n:fill -- de ko   (only these)
import { readdir, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { translateTexts } from '../api/_lib/translate.js'

const DIR = path.resolve('src/i18n/locales')
const PLURAL = /_(zero|one|two|few|many|other)$/
let copied = 0 // plural forms filled from the language's own _other form

const load = async (lng) => (await import(`${pathToFileURL(path.join(DIR, `${lng}.js`)).href}?t=${Date.now()}`)).default

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)

// Collects [setter, englishText] for everything missing in `target`.
function walk(en, target, lng, jobs) {
  const categories = new Intl.PluralRules(lng === 'zh' ? 'zh' : lng).resolvedOptions().pluralCategories
  for (const [key, value] of Object.entries(en)) {
    // Plural groups: make sure the target has every form its language needs.
    const m = PLURAL.exec(key)
    if (m && typeof value === 'string') {
      const base = key.slice(0, -m[0].length)
      if (m[1] !== 'other') continue // handled once, from the _other key
      for (const cat of categories) {
        const k = `${base}_${cat}`
        if (target[k] !== undefined) continue
        // Reuse the language's own plural form when it has one (e.g. Uzbek nouns don't change).
        if (target[`${base}_other`] !== undefined) {
          target[k] = target[`${base}_other`]
          copied += 1
          continue
        }
        const source = (cat === 'one' && en[`${base}_one`]) || value
        jobs.push([(t) => { target[k] = t }, source])
      }
      continue
    }
    if (target[key] !== undefined && !(isObj(value) && isObj(target[key]))) continue
    if (typeof value === 'string') jobs.push([(t) => { target[key] = t }, value])
    else if (isObj(value)) {
      target[key] ??= {}
      walk(value, target[key], lng, jobs)
    } else if (Array.isArray(value)) {
      const out = JSON.parse(JSON.stringify(value))
      target[key] = out
      const fill = (arr) => arr.forEach((item, i) => {
        if (typeof item === 'string') jobs.push([(t) => { arr[i] = t }, item])
        else if (Array.isArray(item)) fill(item)
        else if (isObj(item)) {
          const o = {}
          arr[i] = o
          walk(item, o, lng, jobs)
        }
      })
      fill(out)
    }
  }
}

// Valid JS with readable output (keys unquoted where possible).
function serialize(v, indent = '') {
  const next = `${indent}  `
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== 'object')) return `[${v.map((x) => serialize(x)).join(', ')}]`
    return `[\n${v.map((x) => `${next}${serialize(x, next)},`).join('\n')}\n${indent}]`
  }
  if (isObj(v)) {
    const entries = Object.entries(v).map(([k, x]) => `${next}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${serialize(x, next)},`)
    return `{\n${entries.join('\n')}\n${indent}}`
  }
  return typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'` : String(v)
}

const en = await load('en')
const wanted = process.argv.slice(2)
const files = (await readdir(DIR)).filter((f) => f.endsWith('.js') && f !== 'en.js')
for (const file of files) {
  const lng = file.slice(0, -3)
  if (wanted.length && !wanted.includes(lng)) continue
  const target = await load(lng)
  const jobs = []
  copied = 0
  walk(en, target, lng, jobs)
  if (!jobs.length && !copied) {
    console.log(`${lng}: complete`)
    continue
  }
  const results = jobs.length ? await translateTexts(jobs.map((j) => j[1]), lng, 'en') : []
  let failed = 0
  jobs.forEach(([set, source], i) => {
    if (typeof results[i] === 'string') set(results[i])
    else { set(source); failed += 1 }
  })
  await writeFile(path.join(DIR, file), `// Hand-written translations; keys missing from en.js are filled by scripts/i18n-fill.mjs.\nexport default ${serialize(target)}\n`)
  console.log(`${lng}: filled ${jobs.length - failed + copied} keys${failed ? `, ${failed} left in English` : ''}`)
}
