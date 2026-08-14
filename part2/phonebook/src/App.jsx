import { useState, useEffect } from "react"
import numberService from "./services/numbers"
import Notification from "./components/Notification"
import Error from "./components/Error"

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <ShowPeople
          key={person.id}
          person={person}
          deletePerson={deletePerson}
        />
      ))}
    </div>
  )
}

const SearchFilter = ({ search, handleSearch }) => {
  return (
    <div>
      filter shown with
      <input value={search} onChange={handleSearch} />
    </div>
  )
}

const ShowPeople = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </div>
  )
}

const PersonForm = ({
  onSubmit,
  newName,
  newNumber,
  handleAddPerson,
  handleAddNumber,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input value={newName} onChange={handleAddPerson} />
      </div>
      <div>
        number:
        <input type="tel" value={newNumber} onChange={handleAddNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [addedMessage, setAddedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    numberService.getAll().then((initialNumbers) => {
      setPersons(initialNumbers)
    })
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const onlyLetters = /^[A-Za-zÅÄÖåäö' -]+$/

    if (!onlyLetters.test(newName)) {
      alert(`Name can only contain letters a-ö and ' `)
      return
    }

    const existingPerson = persons.find(
      (person) =>
        person.name.trim().toLowerCase() === newName.trim().toLowerCase(),
    )

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`,
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        numberService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? returnedPerson : person,
              ),
            )
            setNewName("")
            setNewNumber("")
            setAddedMessage(`Added '${returnedPerson.name}'`)
            setTimeout(() => setAddedMessage(null), 5000)
          })
          .catch((errorMessage) => {
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from the server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id),
            )
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    }

    numberService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        setAddedMessage(`Added '${returnedPerson.name}'`)
        setTimeout(() => setAddedMessage(null), 5000)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      numberService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
        })
        .catch((errorMessage) => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`)
          setTimeout(() => setErrorMessage(null), 5000)
          setPersons(persons.filter((person) => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addedMessage} />
      <Error message={errorMessage} />
      <SearchFilter handleSearch={handleSearch} search={search} />
      <h2>Add a new person</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleAddPerson={handleAddPerson}
        newNumber={newNumber}
        handleAddNumber={handleAddNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}
export default App
