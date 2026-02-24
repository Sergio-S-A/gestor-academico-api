import { TransformFnParams } from 'class-transformer';


export const trimString = ({ value }: TransformFnParams) => {
    if (value === null || value === undefined) return value;

    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value !== 'string') return value;
    return value.trim();
};


export const normalizeEmail = ({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
};


export const toBoolean = ({ value }: TransformFnParams) => {
    if (value === true || value === false) return value;
    if (typeof value !== 'string') return value;

    const normalized = value.trim().toLowerCase();
    const truthyValues = ['true', '1', 'si', 'sí', 'yes', 'activo', 'habilitado', 'on'];

    return truthyValues.includes(normalized);
};


export const toInt = ({ value }: TransformFnParams) => {
    return parseInt(value, 10);
};


export const toLowerCase = ({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
};


export const toFloat = ({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    return value;
};