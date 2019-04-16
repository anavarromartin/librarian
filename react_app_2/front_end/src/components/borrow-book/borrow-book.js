import React, {useEffect, useState} from 'react';
import './borrow-book.scss'
import classNames from 'classnames'
import SearchInput from "../search-input/search-input";

const BorrowBook = ({
                        getAvailableBooks = () => {},
                        setHeaderVisibility = () => {},
                        borrowBook = () => {},
                        setBackLocation = () => {},
                        setHeaderConfig = () => {},
                        history = {},
                        office
}) => {

    const [searching, setSearching] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)

    useEffect(() => {
        setBackLocation(`/${office.name.toLowerCase()}`)
        setHeaderConfig({displayButtons: false})
    }, [])

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const handleBorrow = async () => {
        if (selectedBook && name.trim() !== '' && email.trim() !== '') {
            await borrowBook(selectedBook.id, name, email)
            history.push(`/${office.name}`)
        }
    }

    return (
        <div className={classNames("borrow__top-container", {searching: searching})}>
            <h1 className={"borrow__title"}>Borrow A Book</h1>
            <div className={"borrow__find"}>
                <label className={"borrow__find-label"}>Find an Available Book</label>
                <SearchInput
                    isSearching={setSearching}
                    search={term => getAvailableBooks(office.id, term)}
                    onSelectResult={setSelectedBook}
                />
            </div>

            <div className={"borrow__name"}>
                <label>Your Full Name<span style={{color: '#bf1e25'}}>*</span></label>
                <input type="text" onChange={event => setName(event.target.value)}/>
            </div>

            <div className={"borrow__email"}>
                <label>Your Email<span style={{color: '#bf1e25'}}>*</span></label>
                <input type="text" onChange={event => setEmail(event.target.value)}/>
            </div>

            <button
                className={classNames("teal-button", "borrow__button")}
                onClick={handleBorrow}
            >
                BORROW
            </button>
        </div>
    )
}

export default BorrowBook