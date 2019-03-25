import axios from 'axios'
import searchService from "./search-service"


jest.mock('axios')

it('search books', () => {
    let searchUrl = ''
    axios.get.mockImplementationOnce((url) => {searchUrl = url})

    searchService.searchBooks('book')

    expect(searchUrl).toEqual(`${process.env.REACT_APP_API_URL}/api/offices/1/books?search=book`)
})