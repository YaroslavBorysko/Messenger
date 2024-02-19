import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL

class UserService {

  static getMessages = async (recipientId) => {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}api/message/${recipientId}/`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${window.localStorage.getItem("jwt_session")}`,
        "Accept": "application/json"
      },

    })
    return response.data
  }

  static getAllUsers = async () => {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}api/user/`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${window.localStorage.getItem("jwt_session")}`,
        "Accept": "application/json"
      },

  })
    return response.data
  }

  static registerUser = async (userRegisterData) => {

    const response = await axios.post(
      `${baseUrl}api/auth/users/`,
      userRegisterData
    )
    return response.data
  }
  static loginUser = async (userLoginData) => {
    const response = await axios.post(
      `${baseUrl}api/auth/jwt/create/`,
      userLoginData
    )
    return response.data
  }
}

export default UserService