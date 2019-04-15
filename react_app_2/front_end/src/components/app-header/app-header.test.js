import React from 'react';
import AppHeader from "./app-header"
import {shallow} from 'enzyme'

let component

const OFFICE_ID = 1

const BORROW_BUTTON_SELECTOR = '#header__borrow-button'
const RETURN_BUTTON_SELECTOR = '#header__return-button'

const BACK_BUTTON_SELECTOR = '.app-header__back-button'

const BORROW_BOOK_URL = `/${OFFICE_ID}/borrow`
const RETURN_BOOK_URL = `/${OFFICE_ID}/return`

const clickOn = selector => {
    component.find(selector).simulate('click')
}

describe('<AppHeader />', () => {
    describe('when buttons are enabled', () => {
        let actualUrl
        beforeEach(() => {
            component = shallow(<AppHeader
                match={{params: {officeId: OFFICE_ID}}}
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

    describe('back button', () => {
        describe('when is enabled', () => {
            let historySpy
            beforeEach(() => {
                component = shallow(<AppHeader
                    backButtonEnabled={() => true}
                    onNavigateBack={actualHistory => {historySpy = actualHistory}}
                    history={'TEST_HISTORY'}
                />)
            })

            it('clicking on it triggers back navigation', () => {
                clickOn(BACK_BUTTON_SELECTOR)

                expect(historySpy).toEqual('TEST_HISTORY')
            })
        })

        describe('when is disabled', () => {
            beforeEach(() => {
                component = shallow(<AppHeader
                    backButtonEnabled={() => false}
                />)
            })

            it('is not rendered', () => {
                expect(component.find(BACK_BUTTON_SELECTOR)).not.toExist()
            })
        })
    })
})