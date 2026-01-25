import { useState } from "react"
import { useUserStore } from "../store"

type Props = {
    connect: (token: string) => void
}

export default function LoginPage({ connect }: Props) {

    const { username, setUsername } = useUserStore()
    const [response, setResponse] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [toggleView, setToggleView] = useState<boolean>(true)

    async function registerUser(name: string, password: string) {
        let newUser = JSON.stringify({
            name: name,
            password: password
        })

        try {

            const res = await fetch(import.meta.env.VITE_SERVER_URL + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: newUser
            })

            let data = await res.json()
            if (!res.ok) {
                setResponse(data.response)
                throw new Error("Failed to Create User")
            }

            setResponse(data.response)
            setUsername('')
            setPassword('')
        } catch (err) {
            console.log(err)
        }

    }

    async function loginAndConnect(name: string, password: string) {

        let user = JSON.stringify({
            name: name,
            password: password
        })
        try {
            const res = await fetch(import.meta.env.VITE_SERVER_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: user
            })
            let data = await res.json()
            if (!res.ok) {
                setResponse(data.response)
                throw new Error("Failed To Login")
            }

            
            if (data.token) {
                connect(data.token);
            } else {
                setResponse(data.response)
            }

        } catch (e) {
            console.log()
        }
    }

    return (
        <div className="login-window">
            <h3>Welcome To Chatty McChatface</h3>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <img src="/images/logo.png" alt="logo" width={80} />
                <button className="login-toggle-button" onClick={() => setToggleView(prev => !prev)}>{toggleView ? "Not Registered Click Here?" : "Back To Login"}</button>
                {
                    toggleView ?
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                            <h4>Login:</h4>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                loginAndConnect(username, password);
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label >Username: </label>
                                    <input  
                                        type="text" 
                                        value={username} 
                                        autoComplete='off' // switch these to off as google thinks your harvesting passwords
                                        onChange={(e) => setUsername(e.target.value)} className="input" />
                                    <label>Password:</label>
                                    <input 
                                        type='password' 
                                        value={password} 
                                        autoComplete="off" 
                                        onChange={(e) => setPassword(e.target.value)} className="input" />
                                    <button type='submit'>Login</button>
                                </div>

                            </form>
                        </div>
                        :
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                            <h4>Register:</h4>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                registerUser(username, password);
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label >Username: </label>
                                    <input 
                                        type="text"
                                        value={username} 
                                        autoComplete='off' 
                                        onChange={(e) => setUsername(e.target.value)} className="input" />
                                    <label>Password:</label>
                                    <input 
                                        type='password' 
                                        value={password} 
                                        autoComplete='off' 
                                        onChange={(e) => setPassword(e.target.value)} className="input" />
                                    <button type='submit'>Register</button>
                                </div>
                            </form>
                        </div>
                }


                <p>{response}</p>
            </div>


        </div>
    )
}