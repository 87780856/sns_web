import fetch from '@/utils/fetch'

import fetch2 from '@/utils/fetch2'
export function login(username, password) {
  return fetch2({
    baseURL: 'http://127.0.0.1:8000/test/',
    url: '/login/',
    method: 'post',
    data: {
      username,
      password,
    },

  })
}


export function login2(username, password) {
  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: '/api-token-auth/',
    method: 'post',
    data: {
      username,
      password,
    }
  })
}

export function getInfo(token) {
  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: '/getinfo/',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: '/logout/',
    method: 'post'
  })
}

// export function login(username, password) {
//   return fetch({
//     //baseURL: 'http://127.0.0.1:8000',
//     //baseURL: 'https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin',
//     url: '/user/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }

//   })
// }


// export function getInfo(token) {
//   return fetch({
//     url: '/user/info',
//     method: 'get',
//     params: {
//       token
//     }
//   })
// }

// export function logout() {
//   return fetch({
//     url: '/user/logout',
//     method: 'post'
//   })
// }
