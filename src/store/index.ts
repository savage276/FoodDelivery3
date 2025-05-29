import {createSlice, configureStore} from '@reduxjs/toolkit'

const userStore = createSlice({
    name: "user",
    initialState: {
        token: ''
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const {setToken} = userStore.actions;
const userReducer = userStore.reducer;


export default configureStore({
    reducer: {
        user: userReducer
    }
})
