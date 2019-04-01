import React from 'react';
import './borrow-book.scss'
import classNames from 'classnames'

const BorrowBook = () => (
    <div className={"borrow__top-container"}>
        <h1 className={"borrow__title"}>Borrow A Book</h1>
        <div className={"borrow__find"}>
            <label>Find an Available Book</label>
            <input type="text"/>
        </div>

        <div className={"borrow__name"}>
            <label>Full Name</label>
            <input type="text"/>
        </div>

        <div className={"borrow__email"}>
            <label>Email</label>
            <input type="text"/>
        </div>

        <button className={classNames("teal-button", "borrow__button")}>
            BORROW
        </button>
    </div>
)

// BEM - Block Element Modifier
// block__element--modifier

// borrow-page__button--hovered

export default BorrowBook