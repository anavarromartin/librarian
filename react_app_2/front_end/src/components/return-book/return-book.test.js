import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import { mount } from 'enzyme'
import 'jasmine-enzyme'
import searchService, {getBooks} from "../../services/book-methods"

describe('<ReturnBook />', () => {

    const mountComponent = ({setBackLocation = () => {}, setHeaderVisibility = () => {}, getBooks = () => {}} = {}) => (
        mount(<ReturnBook
            setBackLocation={setBackLocation}
            setHeaderVisibility={setHeaderVisibility}
            getBooks={getBooks}
        />)
    )

    const clickOnSearchInput = component => {
        component.find('.labels-input__input').simulate('click')
    }

    const typeOnSearchInput = (text, component) => {
        component.find(".labels-input__input").simulate('change', { target: { value: text } })
    }

    const resizeWindow = (x, y) => {
        window.innerWidth = x;
        window.innerHeight = y;
        window.dispatchEvent(new Event('resize'));
    }

    describe ('display', () => {
        it('renders the component', () => {
            const component = renderer.create(<ReturnBook setBackLocation={() => {
            }}/>)

            expect(component.toJSON()).toMatchSnapshot()
        })

        describe('when clicking on search input', () => {
            let component
            beforeEach(() => {
                resizeWindow(411, 731)
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

            typeOnSearchInput('Test', mountComponent({getBooks: search => {searchInput = search}}))

            expect(searchInput).toEqual('Test')
        })

        it('when input is empty it does not search', () => {
            let wasCalled = false

            typeOnSearchInput('   ', mountComponent({getBooks: () => {wasCalled = true}}))

            expect(wasCalled).toBeFalsy()
        })
    })
})