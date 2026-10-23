// Requires a WORKFLOW service binding to leap-birthday-bookings.
// Do not restore the old public workers.dev fetch: same-account calls require
// a service binding (or an explicit compatible public-fetch configuration).
export default {
  async scheduled(event, env) {
    if (!env.WORKFLOW) throw Error('Birthday WORKFLOW service binding is missing');
    const response = await env.WORKFLOW.fetch(new Request('https://birthday.internal/internal/tick', {
      method: 'POST', headers: {Authorization: 'Bearer ' + env.TICK_SECRET},
      signal: AbortSignal.timeout(240000)
    }));
    const result = await response.json();
    if (!response.ok || result.errors?.length) throw Error('Birthday automation needs attention');
  },
  async fetch() { return new Response('Not found', {status:404}); }
};
