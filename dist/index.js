import { slugifyWithCounter } from '@sindresorhus/slugify';
import { toString as tStr } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
export default function remarkTranslitSlug(options = {}) {
    const pluginOptions = {
        separator: '-',
        lowercase: true,
        decamelize: false,
        ...options,
    };
    const { preserveExistingIds = true, ...slugifyOptions } = pluginOptions;
    const slugifySettings = slugifyOptions;
    return (tree) => {
        const slugify = slugifyWithCounter();
        visit(tree, 'heading', (node) => {
            const heading = node;
            if (heading.depth === 1) {
                return;
            }
            const text = tStr(heading).trim();
            if (!text) {
                return;
            }
            const data = heading.data ?? (heading.data = {});
            const hProperties = (data.hProperties ??= {});
            if (preserveExistingIds &&
                typeof hProperties.id === 'string' &&
                hProperties.id.trim().length > 0) {
                return;
            }
            const transliteratedId = slugify(text, slugifySettings);
            hProperties.id = transliteratedId;
        });
    };
}
