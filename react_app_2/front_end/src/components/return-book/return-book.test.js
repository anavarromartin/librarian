import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import {mount} from 'enzyme'

const mountComponent = ({
                            setBackLocation = () => {
                            },
                            setHeaderVisibility = () => {
                            },
                            getCheckedOutBooks = () => {
                            },
                            returnBook = () => {
                            },
                            setHeaderConfig = () => {
                            },
                            displayToastMessage = () => {
                            }
                        } = {}) => (
    mount(<ReturnBook
        history={{
            push: () => {
            }
        }}
        office={{id: 1, name: 'dallas'}}
        setBackLocation={setBackLocation}
        setHeaderVisibility={setHeaderVisibility}
        getCheckedOutBooks={getCheckedOutBooks}
        returnBook={returnBook}
        setHeaderConfig={setHeaderConfig}
        displayToastMessage={displayToastMessage}
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
            component = renderer.create(<ReturnBook
                setBackLocation={() => {
                }}
                match={{params: {officeId: 1}}}
            />)
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
                let returnedBook, toastMessage
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
                        },
                        displayToastMessage: message => {
                            toastMessage = message
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

                        it('displays toast message', () => {
                            expect(toastMessage).toEqual('Book returned successfully!')
                        })
                    })
                })
            })
        })
    })

    describe('behavior', () => {
        it('when typing it performs search', done => {
            typeOnSearchInput('Test', mountComponent({
                getCheckedOutBooks: (officeId, search) => {
                    expect(officeId).toEqual(1)
                    expect(search).toEqual('Test')
                    done()
                }
            }))
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

    it('sets back location to office root', done => {
        mount(<ReturnBook
            office={{id: 1, name: 'dallas'}}
            setBackLocation={location => {
                expect(location).toEqual('/dallas')
                done()
            }}
        />)
    })

    it('sets the header buttons as not visible', done => {
        mount(<ReturnBook
            office={{id: 1, name: 'dallas'}}
            setHeaderConfig={config => {
                expect(config.displayButtons).toBeFalsy()
                done()
            }}
        />)
    })
})