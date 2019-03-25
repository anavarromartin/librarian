import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import { shallow } from 'enzyme'
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

            const wrapper = shallow(<ReturnBook/>)
            wrapper.find(".text-input").simulate('change', { target: { value: 'Test' } })

            expect(searchInput).toEqual('Test')
        })
    })
})