import { slugifyWithCounter } from '@sindresorhus/slugify';
import { toString as tStr } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
export default function remarkTranslitSlug(options = {}) {
    const settings = {
        separator: '-',
        lowercase: true,
        decamelize: false,
        ...options,
    };
    return (tree) => {
        const slugify = slugifyWithCounter();
        visit(tree, 'heading', (node) => {
            if (node.depth === 1) {
                return;
            }
            const text = tStr(node);
            if (!text) {
                return;
            }
            const transliteratedId = slugify(text, settings);
            node.data = node.data || {};
            node.data.hProperties = {
                ...node.data.hProperties,
                id: transliteratedId,
            };
        });
    };
}
