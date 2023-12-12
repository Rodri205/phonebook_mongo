import { useState, useEffect, useRef } from 'react'
import Filter from './component/Filter'
import personService from './services/persons'
import Persons from './component/Persons'
import PersonForm from './component/PersonForm'
import Notification from './component/Notification'
import './App.css'

function App () {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')

  /// //// G E T   P E R S O N ////////
  const hook = () => {
    personService.getAll().then((inicialPersons) => {
      setPersons(inicialPersons)
    })
  }
  useEffect(hook, [])

  /// //// A D D   P E R S O N ////////
  const addPerson = async (event) => {
    event.preventDefault()
    // Check if the name has more than 2 characters
    /* if (newPerson.length <= 2) {
      setConfirmation(
        `Person validation failed: name '${newPerson}' code lenght (3)`

      );
      setTimeout(() => {
        setConfirmation(null);
      }, 3000);
      return;
    } */
    const personObject = {
      name: newPerson,
      number: newNumber
    }

    if (
      persons.some(
        (persons) => persons.name === newPerson && persons.number === newNumber
      )
    ) {
      alert(`${newPerson} is already added to phonebook`)
      setNewPerson('')
      setNewNumber('')
      inputRef.current.focus()
    } else if (
      persons.some(
        (persons) => persons.name === newPerson && persons.number !== newNumber
      )
    ) {
      const existingPerson = persons.find(
        (persons) => persons.name === newPerson && persons.number !== newNumber
      )
      if (
        window.confirm(
          `${newPerson} is already added to phonebook, replace the old numbrer with a new one?`
        )
      ) {
        handleUpdateNumber(existingPerson.id, newPerson, newNumber)
      }
    } else {
      handleAddPerson(personObject)
    }
  }

  /// // A D D   P E R S O N   M E T H O D //////

  const handleAddPerson = async (personObject) => {
    try {
      /* const response = await axios.post(
      "http://localhost:3000/api/persons",
      personObject
    ); */
      personService
        .create(personObject)
        .then(() => {
          setNewPerson('')
          setNewNumber('')
          inputRef.current.focus()
          setConfirmation(
            `This contact '${newPerson}' '${newNumber}' has been added to phonebook`
          )
          setTimeout(() => {
            setConfirmation(null)
          }, 3000)
          // setPersons([...persons, personObject]);
          // setPersons(persons.filter((person) => person.id !== id));
          hook()
        })
        .catch((error) => {
          setConfirmation(error.response.data.error)
          setTimeout(() => {
            setConfirmation(null)
          }, 3000)
          // console.log(error.response.data.error)
        })
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error)
    }
  }

  /// // F I L T E R   P E R S O N S ///////
  const filteredPerson = persons.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (value) => {
    setFilter(value)
  }

  /// /// U P D A T E   P E R S O N S ///////////
  const handleUpdateNumber = async (id, newPerson, newNumber) => {
    const personUpdate = {
      name: newPerson,
      number: newNumber
    }
    try {
      personService.update(id, personUpdate).then(() => {
        setNewPerson('')
        setNewNumber('')
        inputRef.current.focus()
        setConfirmation(
          `The number '${newNumber}' has been updated to '${newPerson}`
        )
        setTimeout(() => {
          setConfirmation(null)
        }, 3000)
        hook()
      })
    } catch (error) {
      console.error('Error updating person:', error)
    }
  }

  /// / R E M O V E   P E R S O N ///////
  const handleRemove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      // axios.delete(`http://localhost:3000/api/persons/${id}`);
      personService.remove(id).then(() => {
        setConfirmation(`The '${name}' has been removed from server`)
        setTimeout(() => {
          setConfirmation(null)
        }, 3000)
      })
      setPersons(persons.filter((person) => person.id !== id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={confirmation} messageError={error} />

      <Filter value={filter} onChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        inputRef={inputRef}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPerson} onRemove={handleRemove} />
    </div>
  )
}

export default App
