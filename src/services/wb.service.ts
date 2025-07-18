import { WBTariff } from "#types/index.js";
import axios from "axios";

export async function fetchWBTariffs(): Promise<WBTariff[]> {
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    // Если нет токена — используем моки
    if (!process.env.WB_API_TOKEN?.trim()) {
        console.warn("Using mock data (no WB token)");
        return [
            {
                date: currentDate,
                warehouseName: "Коледино (MOCK)",
                deliveryBase: 48,
                storageBase: 0.1,
                coefficient: 160,
            },
        ];
    }

    try {
        const response = await axios.get(`https://common-api.wildberries.ru/api/v1/tariffs/box?date=${currentDate}`, {
            headers: {
                Authorization: `Bearer ${process.env.WB_API_TOKEN}`,
            },
        });

        const { warehouseList, dtNextBox, dtTillMax } = response.data.response.data;

        return warehouseList.map((wh: any) => ({
            date: validateDate(dtNextBox) || validateDate(dtTillMax) || currentDate,
            warehouseName: wh.warehouseName,
            deliveryBase: parseNumericValue(wh.boxDeliveryBase),
            storageBase: parseNumericValue(wh.boxStorageBase),
            coefficient: parseNumericValue(wh.boxDeliveryAndStorageExpr),
        }));
    } catch (error) {
        console.error("WB API Error:", error instanceof Error ? error.message : error);
        return [];
    }
}

function parseNumericValue(value: string): number {
    if (value === "-" || !value.trim()) return 0;
    const normalized = value.replace(",", ".").trim();

    const result = parseFloat(normalized);

    if (isNaN(result)) {
        console.warn(`Invalid numeric value: ${value}`);
        return 0;
    }

    return result;
}

function validateDate(dateStr: string): string | null {
    if (!dateStr) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;

    const date = new Date(dateStr);

    // Проверяем, что дата валидна и совпадает с исходной строкой (предотвращает например "2023-02-30")
    if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateStr) {
        return null;
    }
    return dateStr;
}
