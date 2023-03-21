const express = require('express');
const router = express.Router();
const Joi = require('joi');
const expressJoi = require('express-joi-validation');
const logger = require('../Middlewares/logging');
const { deductionsValidator, exemptionsValidator } = require('../Utilities/calculationValidators');
const { getNewTaxableIncome, getOldTaxableIncome, getGrossSalary, getTaxes } = require('../Utilities/taxCalculations');

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

const validator = expressJoi.createValidator({});

router.post('/getGrossSalary', validator.body(incomeFormSchema) ,(req, res) => {
    const data = req.body;
    const grossSalary = getGrossSalary(data);
    res.json({ status: "success", data: {...grossSalary}});
});


router.post('/oldRegime/getTaxableIncome', validator.body(combinedFormSchema),(req, res) => {
    const data = req.body;

    // Check exemptions and deductions claimed are valid
    exemptionsValidator(data);
    deductionsValidator(data);

    const taxableIncome = getOldTaxableIncome(data);

    res.json({ status: "success", data: {...taxableIncome}});
});

router.post('/newRegime/getTaxableIncome', (req, res) => {
    // the new regime does not have deductions or exemptions
    const data = req.body;
    const taxableIncome = getNewTaxableIncome(data);
    res.json({ status: "success", data: {...taxableIncome}});
});

router.post('/getTaxes', (req, res) => {
    // handle POST request for '/forms'
    const data = req.body;
    exemptionsValidator(data);
    deductionsValidator(data);
    const taxes = getTaxes(data);
    res.json({ status: "success", data: {...taxes}});
});



module.exports = router;