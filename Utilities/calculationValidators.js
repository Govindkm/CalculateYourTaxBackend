const deductionsValidator = function (data) {

    const deductions80C = data.deductionForm.section80C.ppf  + data.deductionForm.section80C.elss + data.deductionForm.section80C.others;
    const total80C = deductions80C + data.deductionForm.section80C.nps;
    const deductions80D = data.deductionForm.section80D.parentsHIS + data.deductionForm.section80D.selfHIS;
    const deductions80G = data.deductionForm.section80G;

    if(deductions80C>150000){
        throw new Error("Deductions under Section 80C cannot be more than 150000");
    } 

    if(data.deductionForm.section80C.nps>50000){
        throw new Error("Deductions under Section 80CCD for NPS cannot be more than 50000");
    }

    if(data.deductionForm.section80D.selfHIS>25000){
        throw new Error("Deductions under Section 80D cannot be more than 25000 for self");
    }

    if(data.deductionForm.section80D.parentsHIS>25000 && data.deductionForm.section80D.yourParentsAge==false){
        throw new Error("Deductions under Section 80D cannot be more than 25000 for parents if they are not senior citizens");
    } else if(data.deductionForm.section80D.parentsHIS>50000 && data.deductionForm.section80D.yourParentsAge==true){
        throw new Error("Deductions under Section 80D cannot be more than 50000 for parents if they are senior citizens");
    }        

    if(deductions80G>10000){
        throw new Error("Deductions under Section 80G cannot be more than 10000");
    }
}

const exemptionsValidator = function (data) {
    if(data.exemptionForm.salaryComponents.hra>(data.incomeForm.hra*12)){
        throw new Error("Claimed HRA Exemption cannot be more than actual HRA received");
    }

    if(data.exemptionForm.salaryComponents.lta>(data.incomeForm.lta*12)){
        throw new Error("Claimed LTA Exemption cannot be more than actual LTA received");
    }
}

module.exports = { exemptionsValidator, deductionsValidator };