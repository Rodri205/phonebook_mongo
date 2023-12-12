import React from "react";

const PersonForm = ({
  onSubmit,
  newPerson,
  setNewPerson,
  newNumber,
  setNewNumber,
  inputRef,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{" "}
        <input
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          ref={inputRef}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;