import * as Joi from 'joi';

// Valida que el .env esté correcto. Corta ejecución si falta DB_HOST, DB_USER, etc.
export const envValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
});