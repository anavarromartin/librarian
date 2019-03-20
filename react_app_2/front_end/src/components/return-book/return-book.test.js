import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"

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

        })
    })

})
