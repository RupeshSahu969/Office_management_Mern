import Api from "./Api"

export const registerUser = (data) => Api.post('/auth/register', data);
export const loginUser = (data) => Api.post('/auth/login', data);
