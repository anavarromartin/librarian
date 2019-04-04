import {mount} from "enzyme/build";
import React from "react";
import BorrowBook from "./borrow-book";

const mountComponent = ({
                            setBackLocation = () => {},
                            setHeaderVisibility = () => {},
                            getAvailableBooks = () => {},
                            borrowBook = () => {}
                        } = {}) => (
    mount(<BorrowBook
        history={{push: () => {}}}
        setBackLocation={setBackLocation}
        setHeaderVisibility={setHeaderVisibility}
        getAvailableBooks={getAvailableBooks}
        borrowBook={borrowBook}
    />)
)

const clickOnFirstSearchResult = component => {
    component.find(".search-results__row").simulate('click')
}

const typeOnSearchInput = (text, component) => {
    component.find(".labels-input__input").simulate('change', {target: {value: text}})
}

const typeOnNameInput = (text, component) => {
    component.find(".borrow__name input").simulate('change', {target: {value: text}})
}

const typeOnEmailInput = (text, component) => {
    component.find(".borrow__email input").simulate('change', {target: {value: text}})
}

const clickOnBorrowButton = component => {
    component.find(".borrow__button").simulate('click')
}

describe('<BorrowBook />', () => {

    it('renders according to snapshot', () => {
        expect(mountComponent()).toMatchSnapshot()
    })

    describe('borrow book flow', () => {
        let component
        let borrowedBookId, borrowerName, borrowerEmail
        beforeEach(async (done) => {
            const availableBooksPromise = Promise.resolve(
                [
                    {
                        id: 1,
                        book_name: 'a book'
                    }
                ]
            )
            component = mountComponent({
                getAvailableBooks: () => {
                    return availableBooksPromise
                },
                borrowBook: (bookId, name, email) => {
                    borrowedBookId = bookId
                    borrowerName = name
                    borrowerEmail = email
                }
            })

            typeOnSearchInput('a book', component)
            await availableBooksPromise
            clickOnFirstSearchResult(component.update())
            typeOnNameInput('adria', component)
            typeOnEmailInput('adria@pivotal.io', component)
            clickOnBorrowButton(component)
            done()
        })

        it('borrows book', () => {
            expect(borrowedBookId).toEqual(1)
            expect(borrowerName).toEqual('adria')
            expect(borrowerEmail).toEqual('adria@pivotal.io')
        })
    })
})