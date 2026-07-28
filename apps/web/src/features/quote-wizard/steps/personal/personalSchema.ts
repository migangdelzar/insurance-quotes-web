import * as yup from 'yup';

export const personalSchema = yup.object({
  name: yup.string().trim().required('wizard.personal.nameRequired'),
  email: yup
    .string()
    .trim()
    .email('wizard.personal.emailInvalid')
    .required('wizard.personal.emailInvalid'),
  age: yup
    .number()
    .typeError('wizard.personal.ageRange')
    .integer('wizard.personal.ageRange')
    .min(18, 'wizard.personal.ageRange')
    .max(120, 'wizard.personal.ageRange')
    .required('wizard.personal.ageRange'),
  zipCode: yup
    .string()
    .matches(/^\d{5}$/, 'wizard.personal.zipFormat')
    .required('wizard.personal.zipFormat'),
});

export type PersonalFormValues = yup.InferType<typeof personalSchema>;
