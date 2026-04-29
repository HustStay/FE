import axios from 'axios'

export const apiFetch = async (url, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body,
    ...restOptions
  } = options

  const response = await axios({
    url,
    method,
    headers,
    data: body,
    validateStatus: () => true,
    ...restOptions
  })

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    statusText: response.statusText,
    url: response.request?.responseURL || url,
    json: async () => response.data,
    text: async () =>
      typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
  }
}

