import React from 'react';
import renderer from 'react-test-renderer';
import Library from "./library"

describe('<Library />', () => {

    it('renders the component', () => {
        const component = renderer.create(<Library />)

        expect(component.toJSON()).toMatchSnapshot()
    })

})
