export const FILTER = 'FILTER';
export const DATE_FROM = `${FILTER}/DATE_FROM`;
export const DATE_TO = `${FILTER}/DATE_TO`;
export const VIEW_TYPE = `${FILTER}/VIEW_TYPE`;
export const CONFIG = 'CONFIG';
export const CHAT_MODE = `${CONFIG}/CHAT_MODE`;

export function setDateFrom(value) {
    return {
        type: DATE_FROM,
        payload: value
    }
}

export function setDateTo(value) {
    return {
        type: DATE_TO,
        payload: value
    }
}

export function setViewType(value) {
    return {
        type: VIEW_TYPE,
        payload: value
    }
}

export function setChatMode(value) {
    return {
        type: CHAT_MODE,
        payload: value
    }
}