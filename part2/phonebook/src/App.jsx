import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({persons}) => {
  return(
    <ul>
      {persons.map(person => (
        <ShowPeople key={person.id} person={person} />
      ))}
    </ul>
  )
}

const SearchFilter = ({search, handleSearch}) => {
  return (
    <div>
      filter shown with
      <input value={search}
      onChange={handleSearch}
      />
    </div>
  )
}

const ShowPeople = ({person}) => {
  return <li>{person.name} {person.number} </li>
}

const PersonForm = ({onSubmit, newName, newNumber, handleAddPerson, handleAddNumber}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input
          value={newName}
          onChange={handleAddPerson}
          />
        </div>
      <div>
        number:
        <input type='number'
          value={newNumber}
          onChange={handleAddNumber}
          />
      </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    console.log('button clicked', event.target)

    const personExists = persons.some(
      person =>
      person.name.trim().toLocaleLowerCase() === newName.trim().toLocaleLowerCase()
    )

    const onlyLetters = /^[A-Za-zÅÄÖåäö' -]+$/

    if (!onlyLetters.test(newName)) {
      alert(`Name can only contain letters a-ö and ' `)
      return
    }

    if (personExists) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleAddPerson = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter
        handleSearch={handleSearch}
        search={search}
        />
      <h2>Add a new person</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleAddPerson={handleAddPerson}
        newNumber={newNumber}
        handleAddNumber={handleAddNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons}/>
    </div>
  )
}
export default App