import {performGet, performPatch} from "./http-methods";

it('performs get call', async () => {
    await expect(performGet('/a/url', {get: url => (url)})).resolves.toBe('/a/url')
})

it('performs patch call', async () => {
    await expect(performPatch('/a/url', 'body', {patch: (url, body) => ([url, body])})).resolves.toEqual(['/a/url', 'body'])
})