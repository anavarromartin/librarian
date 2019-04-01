import {performGet, performPatch} from "./http-methods";

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

const booksWithCheckoutHistories = book => book.checkout_histories.length !== 0
const booksNotReturned = history => !history.checkin_time
const bookAndHistoryToBookModel = (book, history) => (
    {
        id: history.book_id,
        book_name: book.name,
        borrower_name: history.name,
        borrower_email: history.email
    }
)
const bookResponseToBookModels = book => (
    book.checkout_histories
        .filter(booksNotReturned)
        .map(history => bookAndHistoryToBookModel(book, history))
)

export const getCheckedOutBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(booksWithCheckoutHistories)
        .flatMap(bookResponseToBookModels)
)

export const returnBook = async (book, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${book.id}?checkout=false`,
        {name: book.borrower_name, email: book.borrower_email}
    )
)