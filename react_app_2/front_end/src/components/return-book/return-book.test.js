import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"
import { shallow } from 'enzyme'
import 'jasmine-enzyme'

describe('<ReturnBook />', () => {

    describe ('display', () => {
        it('renders the component', () => {
            const component = renderer.create(<ReturnBook setBackLocation={() => {
            }}/>)

            expect(component.toJSON()).toMatchSnapshot()
        })
    })

    describe('behavior', () => {
        it('should set device width when find book input is clicked', () => {
            const axiosSpy = {get: () => {}}
            spyOn(axiosSpy, 'get')

            const wrapper = shallow(<ReturnBook
                axios={axiosSpy}
            />)

            wrapper.find(".text-input").simulate('change', { target: { value: 'Test' } })
            expect(axiosSpy.get).toHaveBeenCalledWith('')
        })
    })
})