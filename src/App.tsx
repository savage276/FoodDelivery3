import React from 'react';
import {RouterProvider} from "react-router-dom";
import router from './router'
import {Provider} from "react-redux";
import store from "./store";

const App: React.FC = () => (
    <div>
        <Provider store={store}>
            <RouterProvider router={router}></RouterProvider>
        </Provider>
    </div>
);

export default App;

