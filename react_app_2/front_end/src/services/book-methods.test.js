import {getBooks} from "./book-methods"

it('search books', async () => {
    await expect(getBooks('book', url => (url))).resolves.toContain(`/api/offices/1/books?search=book`)
})