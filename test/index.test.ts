import { describe, it, expect } from 'vitest';
import remarkTranslitSlug from '../src/index.js';

// Utility function to create a heading node, with optional data.
function createHeading(text: string, depth: number, data?: any) {
  const node: any = {
    type: 'heading',
    depth,
    children: text ? [{ type: 'text', value: text }] : [],
  };
  if (data !== undefined) {
    node.data = data;
  }
  return node;
}

// Utility function to create a minimal AST "root" node.
function createRoot(children: any[]) {
  return { type: 'root', children };
}

describe('remarkTranslitSlug Plugin (minimal tests)', () => {
  it('should add an id for headings with depth > 1', () => {
    const tree = createRoot([
      createHeading('Test Heading', 2),
      createHeading('Title', 1), // Level 1 headings should not be processed.
    ]);

    // Apply the plugin (it modifies the tree in place).
    remarkTranslitSlug()(tree);

    // The level 2 heading should receive an id.
    const headingLevel2 = tree.children[0];
    expect(headingLevel2.data).toBeDefined();
    expect(headingLevel2.data.hProperties).toBeDefined();
    expect(headingLevel2.data.hProperties.id).toBe('test-heading');

    // The level 1 heading should remain unchanged.
    const headingLevel1 = tree.children[1];
    expect(headingLevel1.data).toBeUndefined();
  });

  it('should generate unique ids for duplicate headings', () => {
    const tree = createRoot([
      createHeading('Duplicate Heading', 2),
      createHeading('Duplicate Heading', 2),
    ]);

    remarkTranslitSlug()(tree);

    const id1 = tree.children[0].data.hProperties.id;
    const id2 = tree.children[1].data.hProperties.id;

    expect(id1).toBe('duplicate-heading');
    // Note: The slugifyWithCounter function appends "-2" to the first duplicate.
    expect(id2).toBe('duplicate-heading-2');
  });

  it('should not modify headings with empty text', () => {
    const tree = createRoot([
      createHeading('', 2),
    ]);

    remarkTranslitSlug()(tree);

    // If the heading text is empty, data should not be created.
    expect(tree.children[0].data).toBeUndefined();
  });

  it('should use provided options for slugify', () => {
    const tree = createRoot([
      createHeading('Custom Options Heading', 2),
    ]);

    // Pass an option to use '_' as the separator instead of '-'.
    remarkTranslitSlug({ separator: '_' })(tree);

    const heading = tree.children[0];
    expect(heading.data).toBeDefined();
    expect(heading.data.hProperties).toBeDefined();
    expect(heading.data.hProperties.id).toBe('custom_options_heading');
  });

  it('should preserve existing hProperties on headings', () => {
    // Create a heading with pre-existing data.hProperties.
    const heading = createHeading('Heading with Props', 2, { hProperties: { className: 'custom-class' } });
    const tree = createRoot([heading]);

    remarkTranslitSlug()(tree);

    expect(heading.data.hProperties).toEqual({
      className: 'custom-class',
      id: 'heading-with-props'
    });
  });

  it('should leave non-heading nodes unmodified', () => {
    // Create a minimal tree with a non-heading node (e.g., a paragraph).
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Paragraph text' }],
        },
        createHeading('Valid Heading', 2)
      ]
    };

    remarkTranslitSlug()(tree);

    // Non-heading node should remain unchanged (i.e., no data property).
    expect(tree.children[0].data).toBeUndefined();
    // The heading should be processed as usual.
    expect(tree.children[1].data.hProperties.id).toBe('valid-heading');
  });
});
