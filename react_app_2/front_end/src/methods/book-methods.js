import {performGet, performPatch} from "./http-methods";

Array.prototype.flatMap = function (lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

const booksWithCheckoutHistories = book => book.checkout_histories.length !== 0
const booksNotReturned = history => !history.checkin_time
const bookAndHistoryToBorrowedBookModel = (book, history) => (
    {
        id: history.book_id,
        book_name: book.name,
        borrower_name: history.name,
        borrower_email: history.email
    }
)

const bookResponseToBorrowedBookModels = book =>
    book.checkout_histories
        .filter(booksNotReturned)
        .map(history => bookAndHistoryToBorrowedBookModel(book, history))

const booksAvailable = book => book.available_quantity > 0

export const getCheckedOutBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(booksWithCheckoutHistories)
        .flatMap(bookResponseToBorrowedBookModels)
)

const booksToAvailableBookModel = book => (
    {
        id: book.id,
        book_name: book.name
    }
)

export const getAvailableBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(booksAvailable)
        .map(booksToAvailableBookModel)
)


export const returnBook = async (book, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${book.id}?checkout=false`,
        {name: book.borrower_name, email: book.borrower_email}
    )
)

export const borrowBook = async (bookId, borrowerName, borrowerEmail, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${bookId}?checkout=true`,
        {name: borrowerName, email: borrowerEmail}
    )
)