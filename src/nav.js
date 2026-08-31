// Pure helpers over the flat page list that getPages() returns.

// Distinct Meta Sections in order of first appearance. Each carries its pages and
// the id of the page to open when the section is picked from the nav (its
// Entry Point row, or the first page in the section if none is marked).
export function buildNav(pages) {
  const sections = [];
  const byName = new Map();

  for (const page of pages) {
    let group = byName.get(page.metaSection);
    if (!group) {
      group = { section: page.metaSection, pages: [], entryId: null };
      byName.set(page.metaSection, group);
      sections.push(group);
    }
    group.pages.push(page);
    if (page.entryPoint && !group.entryId) group.entryId = page.id;
  }

  for (const group of sections) {
    if (!group.entryId && group.pages.length) group.entryId = group.pages[0].id;
  }
  return sections;
}

// The page shown on first load when the URL names no (valid) page.
export function defaultPageId(pages) {
  const entry = pages.find((p) => p.entryPoint);
  return (entry || pages[0]).id;
}

export function getPage(pages, id) {
  return pages.find((p) => p.id === id) || null;
}
