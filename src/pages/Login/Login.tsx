import {Button, Form, Input} from 'antd';
import React from 'react';
import {useDispatch} from 'react-redux';
import {fetchLogin} from "../../store/modules/user.ts";

const Login_page: React.FC = () => {
    const dispatch: any = useDispatch();
    const onFinish = async (values: any) => {
        console.log('Success:', values);
        // 触发异步action fetchlogin
        await dispatch(fetchLogin(values))

        // 登录结束
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            validateTrigger={"onBlur"}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{required: true, message: 'Please input your username!'}, {
                    pattern: /^[a-zA-Z0-9]+$/, message: 'Please input correct username!'
                }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: 'Please input your password!'}, {
                    pattern: /^[a-zA-Z0-9]+$/, message: 'Please input correct password!'
                }]}
            >
                <Input.Password/>
            </Form.Item>

            {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
            {/*    <Checkbox>Remember me</Checkbox>*/}
            {/*</Form.Item>*/}

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login_page;