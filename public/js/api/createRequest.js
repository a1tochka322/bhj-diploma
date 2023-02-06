/**
 * Основная функция для совершения запросов
 * на сервер.
 * */


const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    if (options.method === 'GET') {
        options.url += '?';
        for (let key in options.data) {
            options.url += key + '=' + options.data[key] + '&';
        }
        try {
            xhr.open(options.method, options.url);
            xhr.send();
        } catch (e) {
            options.callback(e);
        }
    } else {
        const formData = new FormData();
        for (let key in options.data) {
            formData.append(key, options.data[key])
        }
        try {
            xhr.open(options.method, options.url);
            xhr.send(formData);
        } catch (e) {
            options.callback(e);
        }

    }
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            options.callback(null, xhr.response);
        }
    }
};

