const authTokenIsStored = () => {
    if (localStorage.authToken) return true
    return false
}

const setAuthToken = (newToken) => {
    localStorage.setItem('authToken', newToken)
}

const getAuthToken = () => {
    return localStorage.getItem('authToken')
}

const readUserProfile = async () => {
    const res = await fetch('http://localhost:3000/users/me', {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        }
    })
    try {
        let user = await res.json()
        return user
    } catch (error) {
        return undefined
    }

}

export {
    authTokenIsStored,
    setAuthToken,
    getAuthToken,
    readUserProfile
}