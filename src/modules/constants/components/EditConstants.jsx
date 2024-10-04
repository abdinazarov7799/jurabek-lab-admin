import React from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input} from "antd";
import {useTranslation} from "react-i18next";
import {get, isEqual} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";

const EditConstants = ({setIsModalOpen,refetch,data,id}) => {
    const {t} = useTranslation();
    const {mutate,isLoading} = usePatchQuery({
        listKeyId: KEYS.constants_list
    })
    const onFinish = (values) => {
        const formData = {
            ...values,
            id
        }
        mutate(
            { url: `${URLS.constants_edit}/${id}`, attributes: formData },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    refetch()
                },
            }
        );
    };
    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
            >
                {
                    data?.map((item) => (
                        !isEqual(get(item,'key'), 'id') && <Form.Item
                            label={t(get(item,'key'))}
                            name={get(item,'key')}
                            rules={[{required: true,}]}
                            initialValue={get(item,'value')}
                        >
                            <Input />
                        </Form.Item>
                    ))
                }

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Edit")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditConstants;