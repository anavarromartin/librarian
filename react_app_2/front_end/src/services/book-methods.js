import {performGet} from "./http-methods";


export const getBooks = async (book, doGet = performGet) => {
    return await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`)
}
