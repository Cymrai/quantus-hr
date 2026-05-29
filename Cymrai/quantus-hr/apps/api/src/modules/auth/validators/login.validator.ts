import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const validateLoginInput = (data: { [key: string]: any }) => {
  return loginSchema.validate(data, { abortEarly: false });
};