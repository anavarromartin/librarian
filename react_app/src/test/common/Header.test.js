import React from 'react'
import Header from '../../common/Header'
import { mount } from 'enzyme'
import { MemoryRouter, Route } from 'react-router-dom'

delete window.location
window.location = { reload: jest.fn() }

describe('Header', () => {
    it('should not display Logout button when not logged in', () => {
        window.localStorage.removeItem('access_token')
        
        const wrapper = mount(<MemoryRouter initialEntries={['/offices/dallas']} initialIndex={0}>
            <Route component={props => <Header {...props} />} path='/offices/:officeName' />
        </MemoryRouter>)

        expect(wrapper.find('Header').text()).not.toContain('Logout')
    })

    it('should display Logout button when logged in', () => {
        window.localStorage.access_token = 'asdfasfdasf'
        const wrapper = mount(<MemoryRouter initialEntries={['/offices/dallas']} initialIndex={0}>
            <Route component={props => <Header {...props} />} path='/offices/:officeName' />
        </MemoryRouter>)

        expect(wrapper.find('Header').text()).toContain('Logout')
    })

    it('should remove access_token when clicking Logout button when logged in', () => {
        window.localStorage.access_token = 'asdfasfdasf'
        const wrapper = mount(<MemoryRouter initialEntries={['/offices/dallas']} initialIndex={0}>
            <Route component={props => <Header {...props} />} path='/offices/:officeName' />
        </MemoryRouter>)

        wrapper.find('Button').find('.logout').first().simulate('click')

        expect(window.localStorage.access_token).toEqual(undefined)
    })

    it('should not display Admin Login button when logged in', () => {
        window.localStorage.access_token = 'asdfasfdasf'
        const wrapper = mount(<MemoryRouter initialEntries={['/offices/dallas']} initialIndex={0}>
            <Route component={props => <Header {...props} />} path='/offices/:officeName' />
        </MemoryRouter>)

        expect(wrapper.find('Header').text()).not.toContain('Admin Login')
    })

    it('should display Admin button when not logged in', () => {
        window.localStorage.removeItem('access_token')

        const wrapper = mount(<MemoryRouter initialEntries={['/offices/dallas']} initialIndex={0}>
            <Route component={props => <Header {...props} />} path='/offices/:officeName' />
        </MemoryRouter>)

        expect(wrapper.find('Header').text()).toContain('Admin Login')
    })

    it('should display office name with first letter capitalized', () => {
        const wrapper = mount(<MemoryRouter initialEntries={['/offices/dallas']} initialIndex={0}>
            <Route component={props => <Header {...props} />} path='/offices/:officeName' />
        </MemoryRouter>)

        expect(wrapper.find('Header').text()).toContain('Dallas')
    })
})
