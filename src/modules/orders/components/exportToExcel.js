import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { get } from "lodash";

const exportToExcel = (data, fileName) => {
    const generalInfo = [
        ["Full Name", get(data, "fullName")],
        ["Address", get(data, "address")],
        ["INN", get(data, "inn")],
        ["Pharmacy", get(data, "pharmacy")],
        ["Phone Number", get(data, "phoneNumber")],
        ["User Phone", get(data, "userPhone")],
        ["Total Price", `${Intl.NumberFormat("en-US").format(get(data, "totalPrice", 0))} so'm`],
    ];

    const productHeader = ["№", "Name", "Price", "Quantity"];
    const formattedProducts = data.products.map((product, index) => [
        index + 1,
        get(product, "name"),
        `${Intl.NumberFormat("en-US").format(get(product, "price", 0))} so'm`,
        get(product, "quantity"),
    ]);

    const combinedData = [
        ...generalInfo,
        [],
        [],
        productHeader,
        ...formattedProducts,
    ];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    ws["!cols"] = [
        { wch: 10 },
        { wch: 50 },
        { wch: 20 },
        { wch: 15 },
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
            if (cell) {
                cell.s = {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
            }
        }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Details");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
