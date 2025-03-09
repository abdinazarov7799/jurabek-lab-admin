import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { get } from "lodash";

const exportToExcel = (data, fileName) => {
    const generalInfo = [
        ["Накладная", "(Мобильное приложение)","Дата", new Date().toLocaleDateString()],
        [],
        ["Клиент", get(data, "pharmacy"), "", ""],
        ["Телефон", get(data, "phoneNumber"), "", ""],
        ["Регион", get(data, "region"), "", ""],
        ["Адрес", get(data, "address"), "", ""],
        ["ИНН", get(data, "inn"), "", ""],
        [],
        ["№", "Наименование товара", "Количество", "Цена"],
    ];

    const formattedProducts = data?.products?.map((product, index) => [
        index + 1,
        get(product, "name"),
        get(product, "quantity"),
        get(product, "discountPercent"),
        Intl.NumberFormat("en-US").format(get(product, "price", 0)),
    ]);

    const footerInfo = [
        [],
        [],
        ["","","Номер Агента", get(data, "userPhone"),]
    ];

    const combinedData = [...generalInfo, ...formattedProducts, ...footerInfo];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    ws["!cols"] = [
        { wch: 10 },
        { wch: 70 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Details");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
