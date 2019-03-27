import {performGet, performPatch} from "./http-methods";


export const getBooks = async (book, doGet = performGet) => (
    await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`)
)

export const returnBook = async (bookId, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${bookId}?checkout=false`,
        {name: 'N/A', email: 'N/A'}
    )
)