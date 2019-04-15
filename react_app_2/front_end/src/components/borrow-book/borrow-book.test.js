import {mount} from "enzyme/build";
import React from "react";
import BorrowBook from "./borrow-book";

const OFFICE_ID_AS_URL_PARAM = 1

const mountComponent = ({
                            setBackLocation = () => {},
                            setHeaderVisibility = () => {},
                            getAvailableBooks = () => {},
                            borrowBook = () => {}
                        } = {}) => (
    mount(<BorrowBook
        history={{push: () => {}}}
        match={{params: {officeId: OFFICE_ID_AS_URL_PARAM}}}
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
        let borrowedBookId, borrowerName, borrowerEmail, officeIdUsedToSearch, termUsedToSearch
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
                getAvailableBooks: (actualOfficeId, term) => {
                    officeIdUsedToSearch = actualOfficeId
                    termUsedToSearch = term
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
            expect(officeIdUsedToSearch).toEqual(OFFICE_ID_AS_URL_PARAM)
            expect(termUsedToSearch).toEqual('a book')
            expect(borrowedBookId).toEqual(1)
            expect(borrowerName).toEqual('adria')
            expect(borrowerEmail).toEqual('adria@pivotal.io')
        })
    })

    it('sets back location to office root', done => {
        mount(<BorrowBook
            match={{params: {officeId: 1}}}
            setBackLocation={location => {
                expect(location).toEqual('/1')
                done()
            }}
        />)
    })

    it('sets the header buttons as not visible', done => {
        mount(<BorrowBook
            match={{params: {officeId: 1}}}
            setHeaderConfig={config => {
                expect(config.displayButtons).toBeFalsy()
                done()
            }}
        />)
    })
})