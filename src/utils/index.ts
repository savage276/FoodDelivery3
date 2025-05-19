// 统一中转工具模块，不实现任何逻辑

import { request } from './request.ts'
import {setToken, getToken, removeToken} from "./token.ts";

export {
    request,
    setToken,
    removeToken,
    getToken,
}