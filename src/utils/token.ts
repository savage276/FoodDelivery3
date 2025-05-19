const TOKEN_KEY = "token_key";

function setToken(token: any, key: string = TOKEN_KEY) {
    localStorage.setItem(key, token);
}

function getToken(key: string = TOKEN_KEY) {
    return localStorage.getItem(key);
}

function removeToken(key: string = TOKEN_KEY) {
    localStorage.removeItem(key);
}

export {
    setToken,
    getToken,
    removeToken,
}