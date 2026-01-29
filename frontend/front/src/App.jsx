import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'


function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setfilterusers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" })

  const getAllusers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user");
      setUsers(res.data);
      setfilterusers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  useEffect(() => {
    getAllusers();
  }, []);

  // Search Handle
  const handleSearch = (e) => {
    const searchtext = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchtext) ||
      user.city.toLowerCase().includes(searchtext)
    );
    setfilterusers(filteredUsers);
  };

  // handle Delete
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/user/${id}`);
        getAllusers(); // Refresh the list
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  }

  // handleData
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  // handleAdd
  const handleAdd = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  }

  const handleEdit = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData.id) {
        await axios.patch(`http://localhost:3000/user/${userData.id}`, userData);
      } else {
        await axios.post("http://localhost:3000/user", userData);
      }
      closeModal();
      getAllusers();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }

  return (
    <div className="app-container">
      <h3>CRUD Application</h3>
      <div className="container-header">
        <input
          type='search'
          placeholder='Search users by name or city...'
          onChange={handleSearch}
        />
        <button onClick={handleAdd}>Add Record</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <td>S.No</td>
              <td>Name</td>
              <td>Age</td>
              <td>City</td>
              <td>Edit</td>
              <td>Delete</td>
            </tr>
          </thead>
          <tbody>
            {filterusers && filterusers.length > 0 ? (
              filterusers.map((user, index) => (
                <tr key={user.id || index}>
                  <td data-label="S.No">{index + 1}</td>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Age">{user.age}</td>
                  <td data-label="City">{user.city}</td>
                  <td data-label="Edit">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                  </td>
                  <td data-label="Delete">
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isModalOpen && (
          <div className='modal'>
            <div className="modal-content">
              <span className='close' onClick={closeModal}>&times;</span>
              <h2>{userData.id ? "Edit User Record" : "Add User Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" value={userData.name} onChange={handleData} id="name" placeholder='Enter name' />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" name="age" value={userData.age} onChange={handleData} id="age" placeholder='Enter age' />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" name="city" value={userData.city} onChange={handleData} id="city" placeholder='Enter city' />
              </div>
              <button className="btn-submit" onClick={handleSubmit}>
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
