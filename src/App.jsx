import "./App.css";
import { useState, useRef, useCallback, useEffect } from "react";
import Userpill from "./components/Userpill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const inputRef = useRef(null);

  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const debounceFn = (fn, delay) => {
    let timer;
    let context;
    return (...args) => {
      context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  };

  const fetchUsers = () => {
    if (searchTerm?.trim() === "") {
      setSuggestions([]);
      return;
    }

    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => debounceFn(fetchUsers, 1000), [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const filteredUsers = selectedUsers.filter((suser) => suser.id !== user.id);
    setSelectedUsers(filteredUsers);

    const updateUsersEmails = new Set(selectedUserSet);
    updateUsersEmails.delete(user.email);
    setSelectedUserSet(updateUsersEmails);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers.pop();
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input">
        {selectedUsers.map((user) => {
          return (
            <Userpill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onPillClick={() => handleRemoveUser(user)}
            />
          );
        })}
        <div>
          <input
            type="text"
            value={searchTerm}
            ref={inputRef}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search user..."
            onKeyDown={handleKeyDown}
          />
          <ul className="suggestions-list">
            {suggestions?.users?.map((user) =>
              !selectedUserSet.has(user.email) ? (
                <li key={user.email} onClick={() => handleSelectUser(user)}>
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
