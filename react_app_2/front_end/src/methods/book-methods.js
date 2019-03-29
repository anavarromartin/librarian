import {performGet, performPatch} from "./http-methods";


export const getCheckedOutBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(book => book.checkout_histories.length !== 0)
        .flatMap(book =>
            book.checkout_histories
                .filter(history => !history.checkin_time)
                .map(history => (
                    {
                        id: book.id,
                        book_name: book.name,
                        borrower_name: history.name,
                        borrower_email: history.email
                    }
                ))
        )
)

export const returnBook = async (bookId, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${bookId}?checkout=false`,
        {name: 'N/A', email: 'N/A'}
    )
)