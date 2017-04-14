import React  from 'react'

export default props => {

  const { socket } = props

  return <div>
    <header
      className={ 'header' }
      id={ 'header' }
    >{ 'header' }</header>

    <main id={ 'app_main' }>
      <input
        type={ 'check' }
        onChange={ e => {
          socket.emit('switch', { a: e.target.value })
        } }
      />
    </main>

    <footer
      className={ 'footer' }
      id={ 'footer' }
    >{ 'footer' }</footer>
  </div>
}
