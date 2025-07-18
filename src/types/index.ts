// src/types/index.ts

export interface WBTariffRaw {
    warehouseName: string;
    boxDeliveryBase: string;
    boxStorageBase: string;
    boxDeliveryAndStorageExpr: string;
}

export interface WBTariff {
    date: string;
    warehouseName: string;
    deliveryBase: number;
    storageBase: number;
    coefficient: number;
}

export interface TariffRecord {
    warehouse_name: string;
    delivery_base: number;
    storage_base: number;
    coefficient: number;
    date: string;
}
