import React, {useEffect, useState} from 'react';
import './return-book.scss'
import classNames from 'classnames'
import {routePrefix} from "../../globals"
import SearchInput from "../search-input/search-input";

const ReturnBook = ({
                        setBackLocation,
                        setHeaderVisibility,
                        getCheckedOutBooks,
                        returnBook,
                        history
                    }) => {

    const [searching, setSearching] = useState(false)
    const [selectedResult, selectResult] = useState(null)

    useEffect(() => {
        setBackLocation(`${routePrefix}`)
    })

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const setClassWithModifier = (className) => classNames(className, {[`${className}--searching`]: searching})

    const handleReturnBook = async () => {
        if (selectedResult) {
            await returnBook(selectedResult)
            history.push(`${routePrefix}`)
        }
    }

    return (
        <div className={"container"}>
            <div className={setClassWithModifier("header")}
            >Return A Book
            </div>
            <div className={setClassWithModifier("form")}>
                <label className={setClassWithModifier("label")}
                >Find the Book You Borrowed
                </label>
                <SearchInput
                    isSearching={setSearching}
                    search={getCheckedOutBooks}
                    onSelectResult={selectResult}
                />
                <button className={
                    classNames("teal-button", setClassWithModifier("button-input"))
                }
                        onClick={handleReturnBook}
                >RETURN
                </button>
            </div>
        </div>
    )
}

export default ReturnBook