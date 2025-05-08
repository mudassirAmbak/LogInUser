import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api";
import { getUser, logout } from "../auth";
import Img1 from "../images/e.png";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/users", {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      Swal.fire("Deleted!", "User has been deleted.", "success");

      fetchUsers();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const restoreUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to restore this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it!",
    });

    if (!result.isConfirmed) return;

    try {
      await API.put(
        `/users/restore/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      Swal.fire("Restored!", "User has been restored.", "success");

      fetchUsers();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong while restoring.", "error");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    await API.put(`/users/${editingUser}`, form, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    setEditingUser(null);
    fetchUsers();
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 relative">
      <div className="sticky top-0 z-50 w-full bg-[#435d7d] rounded-lg flex justify-between items-center mb-8">
        <div className="text-white font-sans font-bold ml-8 text-2xl flex flex-col items-center">
          <img
            src={Img1}
            alt="Profile"
            className="w-24 h-24 rounded-full border mb-2 mt-4"
          />
          {currentUser.name}
        </div>

        <h2 className="absolute left-1/2 transform -translate-x-[70%] text-4xl font-extrabold text-white">
          Admin Dashboard
        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-700 hover:bg-red-900 text-white text-2xl font-bold px-5 py-2 rounded-lg shadow-md transition-all duration-300 mr-8"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto  overflow-y-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-300 sticky top-0 z-10">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                Email
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                Role
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <>
                <tr
                  key={u.id}
                  className="border-t text-gray-700 hover:bg-gray-100 transition"
                >
                  <td className="py-4 px-6">{u.name}</td>
                  <td className="py-4 px-6">{u.email}</td>
                  <td className="py-4 px-6 capitalize">{u.role}</td>
                  <td className="py-4 px-6 flex justify-center space-x-2">
                    {u.status === 1 ? (
                      <>
                        <button
                          onClick={() => handleEdit(u)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => restoreUser(u.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>

                {editingUser === u.id && (
                  <tr>
                    <td colSpan="4" className="bg-gray-100 p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Name"
                          className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="Email"
                          className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        />
                        <select
                          value={form.role}
                          onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                          }
                          className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={handleUpdate}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
