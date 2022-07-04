import React from 'react'

function Header({approvers, limit}) {
  return (
    <header>
        <ul>
            <li>Approvers: {approvers.join(', ')}</li>
            <li>Limit: {limit}</li>
        </ul>
    </header>
  )
}

export default Header