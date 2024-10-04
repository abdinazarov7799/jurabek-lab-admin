import React, {useEffect} from 'react';
import {Button, Form, Input, message, notification} from "antd";
import {find, get, isEqual} from "lodash";
import {useTranslation} from "react-i18next";
import TextArea from "antd/es/input/TextArea";
import usePostQuery from "../../../hooks/api/usePostQuery";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";

const LanguageForm = ({data,handleCancel,refetch}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.translations_list,
        hideSuccessToast: true,
    });

    useEffect(() => {
        form.setFieldsValue({
            key: get(data, "key"),
            UZ: get(
                findLang(get(data, "languageSourcePs", []), "UZ"),
                "translation",
                ""
            ),
            RU: get(
                findLang(get(data, "languageSourcePs", []), "RU"),
                "translation",
                ""
            )
        });
    }, [data]);

    const onFinish = (values) => {
        mutate(
            { url: `${URLS.translations_edit}`, attributes: {
                    id: get(data,'id'),
                    key: get(data,'key'),
                    textUz: get(values,'UZ'),
                    textRu: get(values,'RU'),
                }},
            {
                onSuccess: () => {
                    handleCancel();
                    refetch();
                    message.success('Tarjima muvaffaqiyatli amalga oshirildi!')
                },
                onError: () => {
                    message.error( 'Tarjima amalga oshirilmadi!')
                },
            }
        );
    };
    const findLang = (translations = [], lang) => {
        return find(translations, (item) => isEqual(get(item, "language"), lang));
    };
    return (
        <>
            <Form
                name="lang"
                layout={"vertical"}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label={t("Key")}
                    name="key"
                >
                    <TextArea disabled/>
                </Form.Item>

                <Form.Item
                    label={t("Uzbek")}
                    name="UZ"
                >
                    <TextArea allowClear/>
                </Form.Item>

                <Form.Item
                    label={t("Rus")}
                    name="RU"
                >
                    <TextArea allowClear/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        {t("Save")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LanguageForm;