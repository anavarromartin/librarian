import {performGet, performPatch} from "./http-methods";

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

export const getCheckedOutBooks = async (book, doGet = performGet) => (
    (await doGet(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books?search=${book}`))
        .data.data.books
        .filter(book => book.checkout_histories.length !== 0)
        .flatMap(book =>
            book.checkout_histories
                .filter(history => !history.checkin_time)
                .map(history => (
                    {
                        id: history.book_id,
                        book_name: book.name,
                        borrower_name: history.name,
                        borrower_email: history.email
                    }
                ))
        )
)

export const returnBook = async (book, doPatch = performPatch) => (
    await doPatch(
        `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${book.id}?checkout=false`,
        {name: book.borrower_name, email: book.borrower_email}
    )
)