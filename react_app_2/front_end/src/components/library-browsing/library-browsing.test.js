import React from 'react';
import LibraryBrowsing from './library-browsing'
import {mount, shallow} from 'enzyme'

const renderWithABookAndWait = async () => {
    let booksPromise = Promise.resolve([{
        book_name: 'a book',
        quantity: 1,
        imageLink: 'a link'
    }])
    const component = mount(<LibraryBrowsing
        getOfficeBooks={() => booksPromise}
    />)

    await booksPromise

    return component.update()
}

describe('<LibraryBrowsing />', () => {

    it('basic rendering with book matches snapshot', async (done) => {
        const component = await renderWithABookAndWait()

        expect(component).toMatchSnapshot()

        done()
    })

    it('configures no back location', done => {
        shallow(
            <LibraryBrowsing
                setBackLocation={location => {
                    expect(location).toBeFalsy()
                    done()
                }}
            />
        )
    })

    it('configures header to display buttons', done => {
        shallow(
            <LibraryBrowsing
                setHeaderConfig={config => {
                    expect(config.displayButtons).toBeTruthy()
                    done()
                }}
            />
        )
    })
})