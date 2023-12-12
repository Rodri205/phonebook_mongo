const Notification = ({ message, messageError }) => {
  if (message === null) {
    return null;
  }

  return (
    <>{message &&
      <div className="success">
        <p className="textsuccess">{message}</p>
      </div>}
      {messageError &&
      <div className="error">
        <p className="texterror">{messageError}</p>
      </div>}
    </>
  );
};

export default Notification;



