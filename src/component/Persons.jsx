import React from "react";

const Persons = ({ persons, onRemove }) => {
//console.log(persons);
  return (
    
    <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
      {persons.map((person) => (        
        <li style={{ marginBottom: "5px" }} key={person.id}>
          {person.name}{" "}{person.number}
          {" "}<button onClick={()=>onRemove(person.id, person.name)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;