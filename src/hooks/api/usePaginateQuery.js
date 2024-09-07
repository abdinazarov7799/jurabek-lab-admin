import React from "react";
import { useQuery } from "react-query";
import { request } from "../../services/api";
import {notification} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";

const usePaginateQuery = ({
  key = "get-all",
  url = "/",
  page = 1,
  params = {},
  showSuccessMsg = false,
  showErrorMsg = false,
}) => {
  const {t} = useTranslation()
  const { isLoading, isError, data, error, isFetching, refetch} = useQuery(
    [key, page, params],
    () => request.get(`${url}?page=${page}`, params),
    {
      keepPreviousData: true,
      onSuccess: () => {
        if (showSuccessMsg) {
          notification.success({message: t("SUCCESS")
        });
        }
      },
      onError: (data) => {
        if (showErrorMsg) {
          get(data,'response.data.errors',[]).map((err) => (
              notification.error({message: t(get(err,'errorMsg') || 'ERROR')})
          ))
        }
      },
    }
  );

  return {
    isLoading,
    isError,
    data,
    error,
    isFetching,
    refetch
  };
};

export default usePaginateQuery;
