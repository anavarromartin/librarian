import {performGet, performPatch} from "./http-methods";


export const getCheckedOutBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(book => (
            book.checkout_histories.length !== 0
            && !book.checkout_histories[book.checkout_histories.length - 1].checkin_time
        ))

)

export const returnBook = async (bookId, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${bookId}?checkout=false`,
        {name: 'N/A', email: 'N/A'}
    )
)