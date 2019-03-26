import React, {useState} from 'react'
import './label-input.scss'
import classNames from 'classnames'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

library.add(faTimes)

const LabelInput = ({labels, clearLabel, addLabel, onClick, onChange}) => {

    const [inputValue, setInputValue] = useState('')


    const handleChange = event => {
        setInputValue(event.target.value)
        onChange(event)
    }

    const clearInput = () => {
        setInputValue('')
        clearLabel()
    }

    return (
        <div className={"label-input__container"}>
            <div
                className={"labels__container"}
                style={{display: labels.length > 0 ? 'block' : 'none'}}
            >
                {
                    labels.map(label => (
                        <div className={"labels-input__label"}>
                            <div key={label.id} className={"labels-input__label-text"}>
                                {label.name}
                            </div>
                            <FontAwesomeIcon
                                className={"labels-input__label-remove"}
                                icon={faTimes}
                                onClick={clearInput}
                            />
                        </div>
                    ))
                }
            </div>
            <input
                style={{display: labels.length > 0 ? 'none' : 'block'}}
                className={classNames(
                    "labels-input__input",
                    {"labels-input__input--hidden": labels.length > 0}
                )}
                onClick={onClick}
                onChange={handleChange}
                value={inputValue}
                type="text"
            />
        </div>
    )
}

export default LabelInput