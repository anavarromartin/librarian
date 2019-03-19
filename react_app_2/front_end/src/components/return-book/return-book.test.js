import React from 'react';
import renderer from 'react-test-renderer';
import ReturnBook from "./return-book"

describe('<ReturnBook />', () => {

    it('renders the component', () => {
        const component = renderer.create(<ReturnBook setBackLocation={() => {
        }}/>)

        expect(component.toJSON()).toMatchSnapshot()
    })

})
