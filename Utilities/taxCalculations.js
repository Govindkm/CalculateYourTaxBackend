const getOldTaxableIncome = (data) => {
    
    let grossMonthlySalary = data.incomeForm.basicpay + data.incomeForm.da + data.incomeForm.hra + data.incomeForm.lta + data.incomeForm.cityallowance + data.incomeForm.miscellaneous + data.incomeForm.monthlybonus + data.incomeForm.quaterlybonus/4 + data.incomeForm.annualbonus/12;
    let grossAnnualSalary = grossMonthlySalary * 12;
    let totalDeductions = data.deductionForm.section80C.ppf + data.deductionForm.section80C.elss + data.deductionForm.section80C.others + data.deductionForm.section80D.parentsHIS + data.deductionForm.section80D.selfHIS + data.deductionForm.section80G;
    let exemptionsReceived = {hra: Math.min(data.exemptionForm.salaryComponents.hra, data.incomeForm.basicpay*6) , lta: Math.min(data.exemptionForm.salaryComponents.lta, data.incomeForm.lta*12)}
    let totalExemptions = exemptionsReceived.hra + exemptionsReceived.lta;
    let standardDeduction = grossAnnualSalary > 50000 ? 50000 : grossAnnualSalary;

    let taxableIncome = grossAnnualSalary - totalDeductions - totalExemptions - standardDeduction;

    if(taxableIncome<0){
        taxableIncome = 0;
    }

    if((grossAnnualSalary-standardDeduction-totalDeductions)<0){
        taxableIncome = 0;
        totalDeductions = grossAnnualSalary-standardDeduction;
    } else if((grossAnnualSalary-standardDeduction-totalDeductions-totalExemptions)<0){
        taxableIncome = 0;
        totalExemptions = grossAnnualSalary-standardDeduction-totalDeductions;
    }

    return {"Gross Annual Income": grossAnnualSalary, "Taxable Income": taxableIncome, deductions: {total: totalDeductions+totalExemptions+standardDeduction, deductions: {"Chapter VI A deductions": totalDeductions, "Exempt Allowances": totalExemptions, "Standard Deduction": standardDeduction}}};

}

const getNewTaxableIncome = (data) => {
    const grossMonthlySalary = data.incomeForm.basicpay + data.incomeForm.da + data.incomeForm.hra + data.incomeForm.lta + data.incomeForm.cityallowance + data.incomeForm.miscellaneous + data.incomeForm.monthlybonus + data.incomeForm.quaterlybonus/4 + data.incomeForm.annualbonus/12;
    const grossAnnualSalary = grossMonthlySalary * 12;

    const standardDeduction = grossAnnualSalary > 50000 ? 50000 : grossAnnualSalary;

    let taxableIncome = grossAnnualSalary - standardDeduction;

    if(taxableIncome<0){
        taxableIncome = 0;
    }

    return {"Gross Annual Income": grossAnnualSalary, "Taxable Income": taxableIncome, deductions: {total: standardDeduction, deductions: {"Chapter VI A deductions": 0, "Exempt Allowances": 0,"Standard Deduction": standardDeduction}}};
}

const getGrossSalary = (incomeForm) => {
    const grossMonthlySalary = incomeForm.basicpay + incomeForm.da + incomeForm.hra + incomeForm.lta + incomeForm.cityallowance + incomeForm.miscellaneous + incomeForm.monthlybonus + incomeForm.quaterlybonus/4 + incomeForm.annualbonus/12;
    const grossAnnualSalary = grossMonthlySalary * 12;
    return {grossMonthlySalary, grossAnnualSalary};
}

const getTaxes = (data) => {

    const newTaxableIncome = getNewTaxableIncome(data);
    const oldTaxableIncome = getOldTaxableIncome(data);

    const newTax = getNewTax(newTaxableIncome["Taxable Income"]);
    const oldTax = getOldTax(oldTaxableIncome["Taxable Income"]);

    return {newRegimeTax: {...newTaxableIncome, tax: newTax}, oldRegimeTax: {...oldTaxableIncome, tax: oldTax}};
}

const getOldTax = (taxableIncome) => {
    let tax = 0;
    if(taxableIncome > 250000 && taxableIncome <= 500000){
        tax = (taxableIncome - 250000) * 0.05;
    } else if(taxableIncome > 500000 && taxableIncome <= 1000000){
        tax = (taxableIncome - 500000) * 0.2 + 12500;
    } else if(taxableIncome > 1000000){
        tax = (taxableIncome - 1000000) * 0.3 + 112500;
    }
    return tax;
}

const getNewTax = (taxableIncome) => {
    let tax = 0;
    if(taxableIncome > 750000 && taxableIncome <= 900000){
        tax = 15000 + (taxableIncome-600000) * 0.10;
    } else if(taxableIncome > 900000 && taxableIncome <= 1200000){
        tax = 45000 + (taxableIncome-900000) * 0.15;
    } else if(taxableIncome > 1200000 && taxableIncome <= 1500000){
        tax = 90000 + (taxableIncome-1200000) * 0.20;
    } else if(taxableIncome > 1500000){
        tax = 150000 + (taxableIncome-1500000) * 0.3;
    }
    return tax;
}

module.exports = { getOldTaxableIncome, getNewTaxableIncome, getGrossSalary, getTaxes, getOldTax, getNewTax };