import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);

  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  useEffect(() => {
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
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUser([...selectedUser, user]);
    setSearchTerm("");
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSuggestions([]);
  }

  return (
    <div className="search-container">
      <div className="search-input">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search user"
          />
          <ul className="suggestions-list">{
            suggestions?.users?.map((user) => !selectedUserSet.has(user.email) ? (
              <li key={user.email} onClick={handleSelectUser}>
                <img src={user.image} alt={`${user.firstName} ${user.lastName}`}/>
              <span>
                {user.firstName} {user.lastName}
              </span>
              </li>
            ) : (<>

            </>))
          }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
