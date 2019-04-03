import React, {useEffect, useState} from 'react';
import './borrow-book.scss'
import classNames from 'classnames'
import SearchResults from "../search-results/search-results";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import LabelInput from "../label-input/label-input";
import {library} from '@fortawesome/fontawesome-svg-core'

library.add(faChevronLeft);

const BorrowBook = ({getAvailableBooks, setHeaderVisibility}) => {

    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [selectedResult, setSelectedResult] = useState(null)

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const search = async term => {
        term.trim() !== ''
            ? setSearchResults((await getAvailableBooks(term)))
            : setSearchResults([])
    }

    const resetSearch = () => {
        setSearching(false)
        setSearchResults([])
    }

    const handleSelectResult = result => {
        setSelectedResult(result)
        resetSearch()
    }

    const setClassWithModifier = (className) => classNames(className, {[`${className}--searching`]: searching})

    return (
        <div className={"borrow__top-container"}>
            <h1 className={setClassWithModifier("borrow__title")}>Borrow A Book</h1>
            <div className={setClassWithModifier("borrow__find")}>
                <label className={setClassWithModifier("borrow__find-label")}>Find an Available Book</label>
                <div className={setClassWithModifier('borrow__search')}>
                    <div
                        className={setClassWithModifier("borrow__search-back")}
                        onClick={() => resetSearch()}
                    >
                        <FontAwesomeIcon
                            className={setClassWithModifier("text-input__back")}
                            icon={faChevronLeft}
                        />
                    </div>
                    <div className={setClassWithModifier('borrow__search-input')}>
                        <LabelInput
                            labels={selectedResult ? [selectedResult] : []}
                            onClick={() => setSearching(true)}
                            onChange={event => search(event.target.value)}
                            clearLabel={() => setSelectedResult(null)}
                        />
                    </div>
                </div>
                <div
                    className={"borrow__search-results"}
                    style={{display: searchResults.length > 0 ? 'block' : 'none'}}
                >
                    <SearchResults
                        results={searchResults}
                        onSelectResult={handleSelectResult}
                    />
                </div>
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

// BEM - Block Element Modifier
// block__element--modifier

// borrow-page__button--hovered

export default BorrowBook