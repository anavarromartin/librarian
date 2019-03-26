import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import { mount } from 'enzyme'
import 'jasmine-enzyme'
import searchService from "../../services/search-service"

jest.mock('../../services/search-service')

describe('<ReturnBook />', () => {

    describe ('display', () => {
        it('renders the component', () => {
            const component = renderer.create(<ReturnBook setBackLocation={() => {
            }}/>)

            expect(component.toJSON()).toMatchSnapshot()
        })
    })

    describe('behavior', () => {
        it('when typing it performs search', () => {
            let searchInput = ''
            searchService.searchBooks.mockImplementationOnce(search => {
                searchInput = search
            })

            const wrapper = mount(<ReturnBook
                setBackLocation={() => {}}
                setHeaderVisibility={() => {}}
            />)
            wrapper.find(".labels-input__input").simulate('change', { target: { value: 'Test' } })

            expect(searchInput).toEqual('Test')
        })

        it('when input is empty it does not search', () => {
            let wasCalled = false
            searchService.searchBooks.mockImplementationOnce(() => {
                wasCalled = true
            })

            const wrapper = mount(<ReturnBook
                setBackLocation={() => {}}
                setHeaderVisibility={() => {}}
            />)
            wrapper.find(".text-input").simulate('change', { target: { value: '   ' } })

            expect(wasCalled).toBeFalsy()
        })
    })
})