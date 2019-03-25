import axios from "axios"

const searchService = {

    searchBooks: async search => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/offices/1/books?search=${search}`)
    }
}

export default searchService