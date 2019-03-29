import React from 'react'
import './search-results.scss'

const SearchResults = ({results, onSelectResult}) => (
    <div className={"search-results__top-container"}>
        {
            results.map(result => (
                <div
                    key={result.id}
                    className={"search-results__row"}
                    onClick={() => {
                        onSelectResult(result)
                    }}
                >
                    {result.name} - {result.checkout_histories[result.checkout_histories.length - 1].name}
                </div>
            ))
        }
    </div>
)

export default SearchResults