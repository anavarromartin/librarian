import React, {useEffect, useState} from 'react';
import './borrow-book.scss'
import classNames from 'classnames'
import SearchInput from "../search-input/search-input";

const BorrowBook = ({getAvailableBooks, setHeaderVisibility}) => {

    const [searching, setSearching] = useState(false)

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    return (
        <div className={classNames("borrow__top-container", {searching: searching})}>
            <h1 className={"borrow__title"}>Borrow A Book</h1>
            <div className={"borrow__find"}>
                <label className={"borrow__find-label"}>Find an Available Book</label>
                <SearchInput
                    isSearching={setSearching}
                    search={getAvailableBooks}
                />
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
}

export default BorrowBook