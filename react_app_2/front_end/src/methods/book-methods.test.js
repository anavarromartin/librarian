import {getBooks, returnBook} from "./book-methods"

it('search books', async () => {
    await expect(getBooks('book', url => (url))).resolves.toContain(`/api/offices/1/books?search=book`)
})

it('returns book', async () => {
    await expect(returnBook(1, (url, body) => ([url, body]))).resolves.toEqual([
        'http://localhost/api/books/1?checkout=false',
        {
            name: 'N/A',
            email: 'N/A'
        }
    ])
})