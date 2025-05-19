import {createSlice} from '@reduxjs/toolkit';
import {request} from "../../utils";
import {setToken as _setToken, getToken} from "../../utils";

const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() || "",
    },
    reducers: {
        setToken (state, action) {
            state.token = action.payload;
            _setToken(action.payload);
        }
    }
})

const {setToken} = userStore.actions;

const userReducer = userStore.reducer;

// 异步方法
const fetchLogin = (loginForm: any) => {
    return async (dispatch: any) => {
        const res = await request.post("/login", loginForm);
        dispatch(setToken(res.data.token));
    }
}


export {fetchLogin, setToken};
export default userReducer;