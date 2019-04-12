import React from 'react';
import AppHeader from "./app-header"
import {shallow} from 'enzyme'
import 'enzyme-matchers'

let component

const BORROW_BUTTON_SELECTOR = '#header__borrow-button'
const RETURN_BUTTON_SELECTOR = '#header__return-button'

const BORROW_BOOK_URL = '/borrow'
const RETURN_BOOK_URL = '/return'

describe('<AppHeader />', () => {
    describe('when buttons are enabled', () => {
        let actualUrl
        beforeEach(() => {
            component = shallow(<AppHeader
                history={{push: urlPassedIn => actualUrl = urlPassedIn}}
                headerConfig={{displayButtons: true}}
            />)
        })

        it('clicking on borrow, navigates to borrow book page', () => {
            clickOn(BORROW_BUTTON_SELECTOR)
            assertThatNavigatesTo(BORROW_BOOK_URL)
        })

        it('clicking on return, navigates to return book page', () => {
            clickOn(RETURN_BUTTON_SELECTOR)
            assertThatNavigatesTo(RETURN_BOOK_URL)
        })

        const assertThatNavigatesTo = expectedUrl => {
            expect(actualUrl).toEqual(expectedUrl)
        }
    })

    describe('when buttons are not enabled', () => {
        beforeEach(() => {
            component = shallow(<AppHeader
                headerConfig={{displayButtons: false}}
            />)
        })

        it("doesn't render the buttons", () => {
            expect(component.find(BORROW_BUTTON_SELECTOR)).not.toExist()
            expect(component.find(RETURN_BUTTON_SELECTOR)).not.toExist()
        })
    })
    const clickOn = selector => {
        component.find(selector).simulate('click')
    }
})