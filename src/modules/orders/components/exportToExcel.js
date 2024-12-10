import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {get} from "lodash";

const exportToExcel = (data, fileName) => {
    const formattedProducts = data.products.map((product, index) => ({
        Index: index + 1,
        Name: get(product, "name"),
        ID: get(product, "id"),
        Price: get(product, "price"),
        Quantity: get(product, "quantity"),
        ImageURL: get(product, "imageUrl"),
    }));

    const generalInfo = [
        { Field: "ID", Value: get(data,'id') },
        { Field: "Full Name", Value: get(data,'fullName') },
        { Field: "Address", Value: get(data,'address') },
        { Field: "INN", Value: get(data,'inn') },
        { Field: "Pharmacy", Value: get(data,'pharmacy') },
        { Field: "Phone Number", Value: get(data,'phoneNumber') },
        { Field: "User Phone", Value: get(data,'userPhone') },
        { Field: "Status", Value: get(data,'status') },
        { Field: "Total Price", Value: get(data,'totalPrice') },
    ];

    const wsGeneral = XLSX.utils.json_to_sheet(generalInfo);
    const wsProducts = XLSX.utils.json_to_sheet(formattedProducts);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsGeneral, "General Info");
    XLSX.utils.book_append_sheet(wb, wsProducts, "Products");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
