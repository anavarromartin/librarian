import React from 'react';
import BookDetail from './book-detail'
import {mount, shallow} from 'enzyme'

let officeIdUsedToFetchBooks,
    isbnUsedToFetchOfficeBook,
    isbnUsedToGetDescription

const bookPromise = Promise.resolve([{
    id: 1,
    book_name: 'I are book',
    quantity: 0,
    imageLink: 'link',
    authors: 'Adria'
}])

const descriptionPromise = Promise.resolve('very interesting book')

const mountComponent = () => (
    mount(<BookDetail
        match={{params: {isbn: '123'}}}
        office={{id: 1, name: 'dallas'}}
        getBooksByIsbn={(officeId, isbn) => {
            officeIdUsedToFetchBooks = officeId
            isbnUsedToFetchOfficeBook = isbn
            return bookPromise
        }}
        getBookDescriptionByIsbn={isbn => {
            isbnUsedToGetDescription = isbn
            return descriptionPromise
        }}
        setBackLocation={() => {}}
        setHeaderConfig={() => {}}
    />)
)

describe('<BookDetail />', () => {
    let component

    beforeEach(async done => {
        component = mountComponent()
        await bookPromise
        await descriptionPromise
        done()
    })

    it('matches snapshot', () => {
        expect(component.update()).toMatchSnapshot()
    })

    it('fetches book', () => {
        expect(officeIdUsedToFetchBooks).toEqual(1)
        expect(isbnUsedToFetchOfficeBook).toEqual('123')
    })

    it('fetches description', () => {
        expect(isbnUsedToGetDescription).toEqual('123')
    })
})