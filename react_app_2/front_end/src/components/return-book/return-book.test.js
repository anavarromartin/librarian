import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import {mount} from 'enzyme'
import 'jasmine-enzyme'
import {getBooks} from "../../methods/book-methods"

const mountComponent = ({
                            setBackLocation = () => {},
                            setHeaderVisibility = () => {},
                            getCheckedOutBooks = () => {}
                        } = {}) => (
    mount(<ReturnBook
        setBackLocation={setBackLocation}
        setHeaderVisibility={setHeaderVisibility}
        getCheckedOutBooks={getCheckedOutBooks}
    />)
)

const clickOnSearchInput = component => {
    component.find('.labels-input__input').simulate('click')
}

const typeOnSearchInput = (text, component) => {
    component.find(".labels-input__input").simulate('change', {target: {value: text}})
}

describe('<ReturnBook />', () => {

    describe('display', () => {
        it('renders the component', () => {
            const component = renderer.create(<ReturnBook setBackLocation={() => {
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