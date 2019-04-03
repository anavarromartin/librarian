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

const bookAndHistoryToAvailableBookModel = (book, history) => (
    {
        id: history.book_id,
        book_name: book.name
    }
)

const bookResponseToBorrowedBookModels = book =>
    book.checkout_histories
        .filter(booksNotReturned)
        .map(history => bookAndHistoryToBorrowedBookModel(book, history))

const historiesWithCheckinTime = history => history.checkin_time

const booksAvailable = book =>
    book.checkout_histories.length === 0
    || book.checkout_histories
        .filter(historiesWithCheckinTime)
        .length > 0


export const getCheckedOutBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(booksWithCheckoutHistories)
        .flatMap(bookResponseToBorrowedBookModels)
)

const booksWithoutCheckoutHistoryToAvailableBookModel = book => (
    {
        id: book.id,
        book_name: book.name
    }
)


const booksWithCheckoutHistoryToAvailableBookModel = book =>
    book.checkout_histories
        .filter(historiesWithCheckinTime)
        .flatMap(history => bookAndHistoryToAvailableBookModel(book, history))


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