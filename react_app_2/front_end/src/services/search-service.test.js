import axios from 'axios'
import searchService from "./search-service"


jest.mock('axios')

it('search books', () => {
    let searchUrl = ''
    axios.get.mockImplementationOnce((url) => {searchUrl = url})

    searchService.searchBooks('book')

    expect(searchUrl).toContain(`/api/offices/1/books?search=book`)
})