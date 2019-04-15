import React, {useEffect, useState} from 'react';
import './return-book.scss'
import classNames from 'classnames'
import SearchInput from "../search-input/search-input";

const ReturnBook = ({
                        setBackLocation = () => {},
                        setHeaderVisibility = () => {},
                        getCheckedOutBooks = () => {},
                        returnBook = () => {},
                        setHeaderConfig = () => {},
                        history = {},
                        match = {}
                    }) => {

    const [searching, setSearching] = useState(false)
    const [selectedResult, selectResult] = useState(null)

    useEffect(() => {
        setBackLocation(`/${match.params.officeId}`)
        setHeaderConfig({displayButtons: false})
    }, [])

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const handleReturnBook = async () => {
        if (selectedResult) {
            await returnBook(selectedResult)
            history.push(`/${match.params.officeId}`)
        }
    }

    return (
        <div className={classNames("container", {searching: searching})}>
            <div className={"header"}
            >Return A Book
            </div>
            <div className={"form"}>
                <label className={"label"}
                >Find the Book You Borrowed
                </label>
                <SearchInput
                    isSearching={setSearching}
                    search={term => getCheckedOutBooks(match.params.officeId, term)}
                    onSelectResult={selectResult}
                />
                <button className={
                    classNames("teal-button", "button-input")
                }
                        onClick={handleReturnBook}
                >RETURN
                </button>
            </div>
        </div>
    )
}

export default ReturnBook