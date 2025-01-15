const handleChangeCurrency = (data) => {
    sessionStorage.setItem("countryCode", data);
    return {
        type: 'CURRENCY',
        payload: data
    }
}
export default handleChangeCurrency;