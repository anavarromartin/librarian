import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import {mount, shallow} from 'enzyme'
import 'jasmine-enzyme'

const mountComponent = ({
                            setBackLocation = () => {
                            },
                            setHeaderVisibility = () => {
                            },
                            getCheckedOutBooks = () => {
                            },
                            returnBook = () => {
                            }
                        } = {}) => (
    mount(<ReturnBook
        history={{push: () => {}}}
        setBackLocation={setBackLocation}
        setHeaderVisibility={setHeaderVisibility}
        getCheckedOutBooks={getCheckedOutBooks}
        returnBook={returnBook}
    />)
)

const clickOnSearchInput = component => {
    component.find('.labels-input__input').simulate('click')
}

const typeOnSearchInput = (text, component) => {
    component.find(".labels-input__input").simulate('change', {target: {value: text}})
}

const clickOnFirstSearchResult = component => {
    component.find(".search-results__row").simulate('click')
}

const clickOnReturnButton = component => {
    component.find(".button-input").simulate('click')
}

describe('<ReturnBook />', () => {

    describe('display', () => {
        it('renders the component', () => {
            let component
                component = renderer.create(<ReturnBook setBackLocation={() => {
                }}/>)
            expect(component.toJSON()).toMatchSnapshot()
        })

        describe('when clicking on search input', () => {
            let component
            beforeEach(() => {
                component = mountComponent()
                clickOnSearchInput(component)
            })

            it('renders search mode', () => {
                expect(component).toMatchSnapshot()
            })

            describe('when searching', () => {
                let returnedBook
                beforeEach(async (done) => {
                    const booksPromise = Promise.resolve(
                        [
                            {
                                id: 1,
                                book_name: 'a book',
                                borrower_name: 'adria',
                            }
                        ])

                    component = mountComponent({
                        getCheckedOutBooks: () => {
                            return booksPromise
                        },
                        returnBook: book => {
                            returnedBook = book
                        }
                    })

                    typeOnSearchInput('a book', component)
                    await booksPromise
                    done()
                })

                it('renders search results', () => {
                    expect(component).toMatchSnapshot()
                })

                describe('when selecting book', () => {
                    beforeEach(() => {
                        clickOnFirstSearchResult(component.update())
                    })

                    it('renders selected result', () => {
                        expect(component).toMatchSnapshot()
                    })

                    describe('when clicking return', () => {
                        beforeEach(() => {
                            clickOnReturnButton(component)
                        })

                        it('returns selected book', () => {
                            expect(returnedBook.book_name).toEqual('a book')
                        })
                    })
                })
            })
        })
    })

    describe('behavior', () => {
        it('when typing it performs search', () => {
            let searchInput = ''

            typeOnSearchInput('Test', mountComponent({
                getCheckedOutBooks: search => {
                    searchInput = search
                }
            }))

            expect(searchInput).toEqual('Test')
        })

        it('when input is empty it does not search', () => {
            let wasCalled = false

            typeOnSearchInput('   ', mountComponent({
                getCheckedOutBooks: () => {
                    wasCalled = true
                }
            }))

            expect(wasCalled).toBeFalsy()
        })
    })
})