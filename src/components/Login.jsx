import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // 1. Lấy danh sách users từ Local Storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Tìm user khớp với Email và Password
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // 3. Nếu đúng: Lưu "phiên đăng nhập" vào Local Storage
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert("Đăng nhập thành công!");

            // Gọi hàm callback để báo cho App.jsx biết đã login
            if (onLoginSuccess) onLoginSuccess(user);
        } else {
            alert("Email hoặc mật khẩu không chính xác!");
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-10 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng Nhập</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Đăng Nhập
                </button>
            </form>
        </div>
    );
};

export default Login;