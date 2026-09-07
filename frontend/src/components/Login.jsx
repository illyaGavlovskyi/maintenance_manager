import { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')

    const handleLogin = () => {
        setError('')
        fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({
                username: username,
                password: password
                })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Invalid username or password')
            }

            return response.json()
        })
        .then((data) => {
            localStorage.setItem('token', data.token)
            window.location.reload()
        })
        .catch(() => {
            setError('Invalid username or password')
            setPassword('')
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()  // Refresh the page to update the UI after logout
    }

    const token = localStorage.getItem('token')

    return (
        <div>
            <h2>Login</h2>

            {token ? (
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
            ) : (
            <>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />

                <button type="button" onClick={handleLogin}>
                Login
                </button>

                {error && <p>{error}</p>}
            </>
            )}
        </div>
    )
}

export default Login