const Joi = require('joi');

const incomeFormSchema = Joi.object({
    basicpay: Joi.number().required(),
    da: Joi.number().required().default(0),
    hra: Joi.number().required().default(0),
    lta: Joi.number().required().default(0),
    cityallowance: Joi.number().required().default(0),
    miscellaneous: Joi.number().required().default(0),
    monthlybonus: Joi.number().required().default(0),
    quaterlybonus: Joi.number().required().default(0),
    annualbonus: Joi.number().required().default(0),
});

const deductionFormSchema = Joi.object({
    section80C: Joi.object({
        ppf: Joi.number().required().default(0),
        
        elss: Joi.number().required().default(0),
        others: Joi.number().required().default(0)
    }).required(),
    nps: Joi.number().required().default(0),
    section80D: Joi.object({
        yourParentsAge: Joi.boolean().optional().default(false),
        parentsHIS: Joi.number().required().default(0),
        selfHIS: Joi.number().required().default(0)
    }).required(),
    section80G: Joi.number().required().default(0)
});

const exemptionFormSchema = Joi.object({
    salaryComponents: Joi.object({
      hra: Joi.number().default(0),
      lta: Joi.number().default(0)
    }).required()
  });

const combinedFormSchema = Joi.object({
    incomeForm: incomeFormSchema.required(),
    deductionForm: deductionFormSchema.required(),
    exemptionForm: exemptionFormSchema.required()
});

module.exports = { combinedFormSchema, incomeFormSchema, deductionFormSchema, exemptionFormSchema };