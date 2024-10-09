import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {useTranslation} from "react-i18next";
import {notification} from "antd";
import {get} from "lodash";

const patchRequest = (url, attributes) => request.patch(url, attributes);

const usePatchQuery = ({hideSuccessToast = false, listKeyId = null}) => {
    const {t} = useTranslation();

        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url, attributes
             }) => patchRequest(url, attributes),
            {
                onSuccess: (data) => {
                    if (!hideSuccessToast) {
                        notification.success({message: t(data?.data?.message || 'SUCCESS')})
                    }

                    if (listKeyId) {
                        queryClient.invalidateQueries(listKeyId)
                    }
                },
                onError: (data) => {
                    get(data,'response.data.errors',[]).map((err) => (
                        notification.error({message: t(get(err,'errorMsg') || 'ERROR')})
                    ))
                }
            }
        );

        return {
            mutate,
            isLoading,
            isError,
            error,
            isFetching,
        }
    }
;

export default usePatchQuery;
