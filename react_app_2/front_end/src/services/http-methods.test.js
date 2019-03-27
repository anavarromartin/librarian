import {performGet} from "./http-methods";

it('performs get call', async () => {
    await expect(performGet('/a/url', {get: url => (url)})).resolves.toBe('/a/url')
})