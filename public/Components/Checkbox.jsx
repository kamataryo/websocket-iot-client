import React from 'react'

/**
 * Generic Checkbox
 * @param {object} props Props
 * @return {ReactComponent} Generic Checkbox
 */
export default props => {

  const { update, checked, label, slug } = props

  return <p>
    <label htmlFor={ slug }>{ label }</label>
    <input
      checked={ checked }
      id={ slug }
      type={ 'checkbox' }
      onChange={ update }
    />
  </p>

}
