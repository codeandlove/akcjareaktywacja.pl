export const CLIENT = 'CLIENT';
export const CLIENT_SET_IP = `${CLIENT}/SET_IP`;

export function setClientIp(value) {
    return {
        type: CLIENT_SET_IP,
        payload: value
    }
}