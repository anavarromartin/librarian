import React, {useEffect, useState} from 'react';
import './search-input.scss'
import classNames from 'classnames'
import {library} from "@fortawesome/fontawesome-svg-core";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LabelInput from "../label-input/label-input";
import SearchResults from "../search-results/search-results";

library.add(faChevronLeft);

const SearchInput = ({
                         isSearching,
                         onSelectResult = () => {},
                         search
                     }) => {
    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [selectedResult, setSelectedResult] = useState(null)
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        isSearching(searching)
    })

    const handleInputChange = async event => {
        const term = event.target.value
        setInputValue(term)
        await performSearch(term)
    }

    const performSearch = async term => {
        term.trim() !== ''
            ? setSearchResults((await search(term)))
            : setSearchResults([])
    }

    const resetSearch = () => {
        setSearchResults([])
        setSearching(false)
        setInputValue('')
    }

    const handleSelectResult = result => {
        setSelectedResult(result)
        onSelectResult(result)
        resetSearch()
    }

    return (
        <div className={classNames({searching: searching})}>
            <div className={"search__field"}>
                <div
                    className={"search__back"}
                    onClick={() => resetSearch()}
                >
                    <FontAwesomeIcon
                        className={"search__back-icon"}
                        icon={faChevronLeft}
                    />
                </div>
                <div className={'search__input'}>
                    <LabelInput
                        labels={selectedResult ? [selectedResult] : []}
                        onClick={() => {
                            setSearching(true)
                        }}
                        onChange={handleInputChange}
                        clearLabel={() => setSelectedResult(null)}
                        value={inputValue}
                    />
                </div>
            </div>
            <div
                className={"search__results"}
                style={{display: searchResults && searchResults.length > 0 ? 'block' : 'none'}}
            >
                <SearchResults
                    results={searchResults}
                    onSelectResult={handleSelectResult}
                />
            </div>
        </div>
    )
}

export default SearchInput