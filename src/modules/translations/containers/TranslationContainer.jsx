import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Input, Modal, Pagination, Row, Table} from "antd";
import {find, get, isEqual} from "lodash";
import {EditOutlined, SearchOutlined} from "@ant-design/icons";
import LanguageForm from "../components/LanguageForm";
import Container from "../../../components/Container.jsx";


const TranslationContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [searchWord, setSearchWord] = useState(null);
    const [selected,setSelected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading,refetch } = usePaginateQuery({
        key: KEYS.translations_list,
        url: URLS.translations_list,
        params: {
            params: {
                search: searchWord,
                size: pageSize,
            },
        },
        page,
    });

    const findLang = (translations = [], lang = "Ru") => {
        return find(translations, (item) => isEqual(get(item, "language"), lang));
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            key: "key",
            title: t("№"),
            width:50,
            render: (props, data, index) => {
                return <>{index + 1}</>
            }
        },
        {
            title: t("Words"),
            dataIndex: "key",
            key: "words",
            width: 500
        },
        {
            title: t("Uz"),
            key: "Uz",
            width: 400,
            render: (props, data, index) => {
                return <>{get(findLang(get(data, "languageSourcePs", []), "UZ"), "translation")}</>
            }
        },
        {
            title: t("Ru"),
            key: "Ru",
            width: 400,
            render: (props, data, index) => {
                return <>{get(findLang(get(data, "languageSourcePs", []), "RU"), "translation")}</>
            }
        },
        {
            title: t("Edit"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Button icon={<EditOutlined />} onClick={() => {
                    showModal();
                    setSelected(data)
                }} />
            )
        }
    ];

    return(
        <Container>
            <Row style={{marginBottom: 10}}>
                <Input
                    size="large"
                    placeholder={t("Search")}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchWord(e.target.value)}
                />
            </Row>
            <Table
                columns={columns}
                dataSource={get(data,'data.data.content',[])}
                bordered
                loading={isLoading}
                size="small"
                pagination={false}
            />
            <Modal title={t("Add Translations")} open={isModalOpen} onCancel={handleCancel} footer={null}>
                <LanguageForm data={selected} handleCancel={handleCancel} refetch={refetch}/>
            </Modal>
            <Row justify={"end"} style={{marginTop: 10}}>
                <Pagination
                    current={page+1}
                    onChange={(page) => setPage(page - 1)}
                    total={get(data,'data.data.totalPages') * 10}
                    showSizeChanger={false}
                />
            </Row>
        </Container>
    )
}
export default TranslationContainer;