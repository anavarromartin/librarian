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

    const setClassWithModifier = (className, isSearching = searching) => classNames(className, {[`${className}--searching`]: isSearching})

    return (
        <div className={"borrow__top-container"}>
            <h1 className={setClassWithModifier("borrow__title")}>Borrow A Book</h1>
            <div className={setClassWithModifier("borrow__find")}>
                <label className={setClassWithModifier("borrow__find-label")}>Find an Available Book</label>
                <SearchInput
                    isSearching={setSearching}
                    search={getAvailableBooks}
                />
            </div>

            <div className={setClassWithModifier("borrow__name")}>
                <label>Full Name</label>
                <input type="text"/>
            </div>

            <div className={setClassWithModifier("borrow__email")}>
                <label>Email</label>
                <input type="text"/>
            </div>

            <button className={classNames(
                "teal-button",
                setClassWithModifier("borrow__button")
            )}>
                BORROW
            </button>
        </div>
    )
}

export default BorrowBook