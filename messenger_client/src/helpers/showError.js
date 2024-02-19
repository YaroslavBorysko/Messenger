export const showError = (data, alertData, setAlertData) => {
    let newAlertData = JSON.parse(JSON.stringify(alertData));
    newAlertData.theme = 'danger';

    try {
        newAlertData.txt = data.response.data.detail;
    } catch (e) {
        newAlertData.txt = "Ooops... Something went wrong";
    }

    setAlertData(newAlertData);
}

export const showMessage = (txt, theme, alertData, setAlertData) => {
    let newAlertData = JSON.parse(JSON.stringify(alertData));
    newAlertData.txt = txt;
    newAlertData.theme = theme;

    setAlertData(newAlertData);
}