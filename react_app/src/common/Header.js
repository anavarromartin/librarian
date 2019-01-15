import React from 'react'

const Header = (props) =>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '4em' }}>{props.match.params.officeName.charAt(0).toUpperCase() + props.match.params.officeName.slice(1)}</span>
    </div>

export default Header