const express = require('express');
const router = express.Router();
const expressJoi = require('express-joi-validation');
const logger = require('../Middlewares/logging');
const { deductionsValidator, exemptionsValidator } = require('../Utilities/calculationValidators');
const { getNewTaxableIncome, getOldTaxableIncome, getGrossSalary, getTaxes } = require('../Utilities/taxCalculations');

const { incomeFormSchema, combinedFormSchema, deductionFormSchema, exemptionFormSchema  } = require('../Models/formModels');

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