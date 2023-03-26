const { ValidationError } = require("../Middlewares/error");
const { getGrossSalary } = require("./taxCalculations");

const deductionsValidator = function (data) {
    const income = getGrossSalary(data.incomeForm);
    const deductions80C = data.deductionForm.section80C.ppf  + data.deductionForm.section80C.elss + data.deductionForm.section80C.others;
    const total80C = deductions80C + data.deductionForm.nps;
    const deductions80D = data.deductionForm.section80D.parentsHIS + data.deductionForm.section80D.selfHIS;
    const deductions80G = data.deductionForm.section80G;
    const total = total80C + deductions80D + deductions80G;

    if(income.grossAnnualSalary<total){
        throw new ValidationError("Total deductions claimed cannot be more than gross income", {deductions: "Total deductions claimed cannot be more than gross income"});
    }

    if(deductions80C>150000){
        throw new ValidationError("Deductions under Section 80C cannot be more than 150000", {section80C: "Deductions under Section 80C cannot be more than 150000"});
    } 

    if(data.deductionForm.nps>50000){
        throw new ValidationError("Deductions under Section 80CCD cannot be more than 50000", {nps: "Deductions under Section 80CCD cannot be more than 50000"});
    }

    if(data.deductionForm.section80D.selfHIS>25000){
        throw new ValidationError("Deductions under Section 80D cannot be more than 25000 for self", {section80D: "Deductions under Section 80D cannot be more than 25000 for self"});
    }

    if(data.deductionForm.section80D.parentsHIS>25000 && data.deductionForm.section80D.yourParentsAge==false){
        throw new ValidationError("Deductions under Section 80D cannot be more than 25000 for parents if they are not senior citizens", {section80D: "Deductions under Section 80D cannot be more than 25000 for parents if they are not senior citizens"});
    } else if(data.deductionForm.section80D.parentsHIS>50000 && data.deductionForm.section80D.yourParentsAge==true){
        throw new ValidationError("Deductions under Section 80D cannot be more than 50000 for parents if they are senior citizens", {section80D: "Deductions under Section 80D cannot be more than 50000 for parents if they are senior citizens"});
    }        

    if(deductions80G>10000){
        throw new ValidationError("Deductions under Section 80G cannot be more than 10000", {section80G: "Deductions under Section 80G cannot be more than 10000"});
    }
}

const exemptionsValidator = function (data) {
    if(data.exemptionForm.salaryComponents.hra>(data.incomeForm.hra*12)){
        throw new ValidationError("Claimed HRA Exemption cannot be more than actual HRA received", {hra: "Claimed HRA Exemption cannot be more than actual HRA received"});
    }

    if(data.exemptionForm.salaryComponents.lta>(data.incomeForm.lta*12)){
        throw new ValidationError("Claimed LTA Exemption cannot be more than actual LTA received", {lta: "Claimed LTA Exemption cannot be more than actual LTA received"});
    }
}

module.exports = { exemptionsValidator, deductionsValidator };