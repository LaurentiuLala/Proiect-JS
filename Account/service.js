function api(path, method = 'GET', body = null) {
    const url = `http://localhost:8080/api/users/${path}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

async function request(path, method = 'GET', body = null) {
    try {
        const response = await api(path, method, body);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage =
                (data && data.message) || response.statusText || 'Request failed';
            throw new Error(errorMessage);
        }

        return {
            success: true,
            status: response.status,
            body: data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
        };
    }
}

export async function getUserById(userId) {
    return request(`getUserById/${userId}`);
}

export async function updateUser(userId, updateRequest) {
    return request(`update/${userId}`, 'PUT', updateRequest);
}
