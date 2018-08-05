import {CLIENT_SET_IP} from './../actions/client';

export function client(state={}, action) {
    switch(action.type) {
        case CLIENT_SET_IP:
            return {
                ...state,
                ip: action.payload
            };
        default:
            return state;
    }
}
