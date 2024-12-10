import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { get } from "lodash";

const exportToExcel = (data, fileName) => {
    // General Info (Header) Format
    const generalInfo = [
        ["Накладная", "(Мобильное приложение)","Дата", new Date().toLocaleDateString()],
        [],
        ["Клиент", get(data, "fullName"), "", ""],
        ["Телефон", get(data, "phoneNumber"), "", ""],
        ["Адрес", get(data, "address"), "", ""],
        ["ИНН", get(data, "inn"), "", ""],
        [],
        ["№", "Наименование товара", "Количество", "Цена"],
    ];

    // Products Section
    const formattedProducts = data?.products?.map((product, index) => [
        index + 1,
        get(product, "name"),
        get(product, "quantity"),
        Intl.NumberFormat("en-US").format(get(product, "price", 0)),
    ]);

    // Footer Section
    const footerInfo = [
        [],
        [],
        ["","","Номер Агента", get(data, "userPhone"),]
    ];

    // Combine All Sections
    const combinedData = [...generalInfo, ...formattedProducts, ...footerInfo];

    // Create WorkSheet
    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    // Column Width Settings
    ws["!cols"] = [
        { wch: 10 }, // №
        { wch: 70 }, // Наименование товара
        { wch: 15 }, // Количество
        { wch: 20 }, // Цена
    ];

    // Create Workbook and Append Sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Details");

    // Export Workbook
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
