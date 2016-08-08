const BASE_URL = 'http://claymaa6.miniserver.com:8080/bristol-pound/'

const apiRequest = (url) =>
  fetch(url)
    .then(response => response.text())
    .then(JSON.parse)

export const getBusinesses = () => {
    console.log(BASE_URL + 'business/');
    return apiRequest(BASE_URL + 'business/');
}
