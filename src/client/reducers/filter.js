import { VIEW_TYPE, DATE_FROM, DATE_TO, CHAT_MODE } from './../actions/filter';

export function filter(state={}, action) {
    switch(action.type) {
        case VIEW_TYPE:
            return {
                ...state,
                viewType: action.payload
            };

        case DATE_FROM:
            return {
                ...state,
                date_from: action.payload
            };

        case DATE_TO:
            return {
                ...state,
                date_to: action.payload
            };

        case CHAT_MODE:
            return {
                ...state,
                chat_mode: action.payload
            };
        default:
            return state;
    }
}
