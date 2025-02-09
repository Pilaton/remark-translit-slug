# remark-translit-slug

[![npm](https://img.shields.io/npm/v/remark-translit-slug?style=for-the-badge&logo=npm&logoColor=white&labelColor=CB3837&color=CB3837)](https://www.npmjs.com/package/remark-translit-slug)

A plugin for [remark](https://github.com/remarkjs/remark) that transliterates headers into slug identifiers.  
Most major languages are supported. The full list can be seen [here](https://github.com/sindresorhus/transliterate#supported-languages).

## Install

```bash
npm install remark-translit-slug
```

## Usage

Plug the plugin into your remark processing chain:

```js
import { remark } from 'remark';
import remarkTranslitSlug from 'remark-translit-slug';
import remarkToc from 'remark-toc';

const file = await remark()
  .use(remarkTranslitSlug, {
    separator: '-', // Separator for slug (default '-')
    lowercase: true, // Make the slug lowercase (defaults to true)
    decamelize: false, // Convert camelcase to separate words. Internally it does fooBar → foo bar. (defaults to false)
  })
  .use(remarkToc);
```

Example usage with `next.js --turbopack` + `@next/mdx`:

```js
import createMdx from '@next/mdx';

// nextConfig ...

const withMdx = createMdx({
  options: {
    remarkPlugins: [
      [
        'remark-translit-slug',
        {
          separator: '-',
          lowercase: true,
        },
      ],
      [
        'remark-toc',
        {
          heading: 'table-of-contents',
          tight: true,
          maxDepth: 3,
        },
      ],
    ],
  },
});
export default withMdx(nextConfig);
```

## Result

Source markdown:

```md
# Hello world!

## Table of contents

---

## Hello in English

## Dobrý den v češtině

## مرحباً بالعربية

## Привет на русском

## Witam w języku polskim
```

The result is this html:

```html
<h1>Hello world!</h1>

<h2 id="table-of-contents">Table of contents</h2>
<ul>
  <li><a href="#hello-in-english">Hello in English</a></li>
  <li><a href="#dobry-den-v-cestine">Dobrý den v češtině</a></li>
  <li><a href="#mrhba-balerbyt">مرحباً بالعربية</a></li>
  <li><a href="#privet-na-russkom">Привет на русском</a></li>
  <li><a href="#witam-w-jezyku-polskim">Witam w języku polskim</a></li>
</ul>

<hr />

<h2 id="hello-in-english">Hello in English</h2>
<h2 id="dobry-den-v-cestine">Dobrý den v češtině</h2>
<h2 id="mrhba-balerbyt">مرحباً بالعربية</h2>
<h2 id="privet-na-russkom">Привет на русском</h2>
<h2 id="witam-w-jezyku-polskim">Witam w języku polskim</h2>
```

This example shows the simultaneous operation of the `remark-translit-slug` plugin and the `remark-toc` plugin.  
The [remark-toc](https://github.com/remarkjs/remark-toc) plugin automatically created a «Table of contents» for us with the correct links that have undergone transliteration.

## API

The plugin is set up so that the basic configuration will work for most and will not require reconfiguration.

But if you do need to make changes, the options are fully consistent with the [Slugify](https://github.com/sindresorhus/slugify) plugin. You can read more about them [here](https://github.com/sindresorhus/slugify?tab=readme-ov-file#api).

## License

MIT
