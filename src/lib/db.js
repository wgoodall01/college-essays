export async function getRequirements(base, essay) {
  const requirements = essay['Required By'];

  if (requirements == null) {
    return []; // no requirements
  }

  const res = await base('Deliverables')
    .select({
      filterByFormula: 'OR(' + requirements.map(e => `RECORD_ID() = "${e}"`).join(', ') + ')'
    })
    .all();

  return res;
}

export async function getEssays(base) {
  // Fetch all active essays
  return base('Writing')
    .select({
      sort: [{field: '_updated', direction: 'desc'}, {field: 'Name', direction: 'asc'}],
      filterByFormula: '{Active}'
    })
    .all();
}
