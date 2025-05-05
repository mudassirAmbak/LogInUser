// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import API from "../api";
// import { getUser } from "../auth";
// import Img1 from "../images/d.png";
// import { logout } from "../auth";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "", role: "user" });
//   const navigate = useNavigate();
//   const currentUser = getUser();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     const res = await API.get("/users", {
//       headers: {
//         Authorization: `Bearer ${currentUser.token}`,
//       },
//     });
//     setUsers(res.data);
//   };

//   const deleteUser = async (id) => {
//     if (!window.confirm("Are you sure to delete this user?")) return;
//     await API.delete(`/users/${id}`, {
//       headers: {
//         Authorization: `Bearer ${currentUser.token}`,
//       },
//     });
//     fetchUsers();
//   };

//   const restoreUser = async (id) => {
//     if (!window.confirm("Are you sure to restore this user?")) return;
//     await API.put(
//       `/users/restore/${id}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       }
//     );
//     fetchUsers();
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setForm({ name: user.name, email: user.email, role: user.role });
//   };

//   const handleUpdate = async () => {
//     await API.put(`/users/${editingUser}`, form, {
//       headers: {
//         Authorization: `Bearer ${currentUser.token}`,
//       },
//     });
//     setEditingUser(null);
//     fetchUsers();
//   };

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         navigate("/login");
//       }
//     });
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 relative">
//       <div className="flex justify-between items-center mb-8">
//         <div className="text-gray-700 font-sans font-bold ml-8 text-2xl">
//           <img
//             src={Img1}
//             alt="Profile"
//             className="w-24 h-24 rounded-full border mb-2"
//           />
//           {currentUser.name}
//         </div>

//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
//         >
//           Logout
//         </button>
//       </div>

//       <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
//         Admin Dashboard
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//           <thead className="bg-gray-300">
//             <tr>
//               <th className="text-left py-4 px-6 font-semibold text-gray-700">
//                 Name
//               </th>
//               <th className="text-left py-4 px-6 font-semibold text-gray-700">
//                 Email
//               </th>
//               <th className="text-left py-4 px-6 font-semibold text-gray-700">
//                 Role
//               </th>
//               <th className="text-center py-4 px-6 font-semibold text-gray-700">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr
//                 key={u.id}
//                 className="border-t text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <td className="py-4 px-6">{u.name}</td>
//                 <td className="py-4 px-6">{u.email}</td>
//                 <td className="py-4 px-6 capitalize">{u.role}</td>
//                 <td className="py-4 px-6 flex justify-center space-x-2">
//                   {u.status === 1 ? (
//                     <>
//                       <button
//                         onClick={() => handleEdit(u)}
//                         className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg transition-all"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteUser(u.id)}
//                         className="bg-red-500 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
//                       >
//                         Delete
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => restoreUser(u.id)}
//                       className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
//                     >
//                       Restore
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {editingUser && (
//         <div className="mt-10 mx-auto max-w-xl bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-2xl font-bold mb-4 text-gray-700">Edit User</h3>
//           <div className="flex flex-col space-y-4">
//             <input
//               type="text"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               placeholder="Name"
//               className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               placeholder="Email"
//               className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <select
//               value={form.role}
//               onChange={(e) => setForm({ ...form, role: e.target.value })}
//               className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//             <button
//               onClick={handleUpdate}
//               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
//             >
//               Update
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api";
import { getUser, logout } from "../auth";
import Img1 from "../images/d.png";

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
    if (!window.confirm("Are you sure to delete this user?")) return;
    await API.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    fetchUsers();
  };

  const restoreUser = async (id) => {
    if (!window.confirm("Are you sure to restore this user?")) return;
    await API.put(
      `/users/restore/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );
    fetchUsers();
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
      <div className="flex justify-between items-center mb-8">
        <div className="text-gray-700 font-sans font-bold ml-8 text-2xl">
          <img
            src={Img1}
            alt="Profile"
            className="w-24 h-24 rounded-full border mb-2"
          />
          {currentUser.name}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          Logout
        </button>
      </div>

      <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        Admin Dashboard
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <>
                <tr key={u.id} className="border-t text-gray-700 hover:bg-gray-100 transition">
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
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Name"
                          className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="Email"
                          className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        />
                        <select
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
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
