const express = require('express');
const router = express.Router();
const { ValidationError, CustomError } = require('../Middlewares/error');

const { incomeFormSchema, combinedFormSchema, deductionFormSchema, exemptionFormSchema } = require('../Models/formModels');
const { deductionsValidator, exemptionsValidator } = require('../Utilities/calculationValidators');

router.post('/validateIncomeForm', (req, res) => {
    const data = req.body;
    const { error } = incomeFormSchema.validate(data);

    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        if (data.basicpay <= 0) {
            throw new ValidationError("Basic Pay cannot be negative or zero", { basicpay: 'Basic Pay cannot be negative or zero' });
        }
        res.json({ status: "success" });
    }
});

router.post('/validateCombinedForm', (req, res) => {
    const data = req.body;
    const { error } = combinedFormSchema.validate(data);
    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        try {
            deductionsValidator(data);
            exemptionsValidator(data);
        } catch (error) {
            throw new CustomError(500, error.message, 'InvalidInputError');
        }
        res.json({ status: "success" });
    }
});

router.post('/validateExemptionForm', (req, res) => {
    const data = req.body;
    const { error } = exemptionFormSchema.validate(data.exemptionForm);
    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        exemptionsValidator(data);
        res.json({ status: "success" });
    }
});

router.post('/validateDeductionForm', (req, res) => {
    const data = req.body;
    const { error } = deductionFormSchema.validate(data.deductionForm);
    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        deductionsValidator(data);
        res.json({ status: "success" });
    }
});


module.exports = router;