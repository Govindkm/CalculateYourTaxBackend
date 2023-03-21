const chai = require('chai');
const expect = chai.expect;
var request = require('supertest');
const app = require('../app');


describe('POST /getGrossSalary', () => {
  it('should calculate gross salary correctly', async () => {
    const res = await request(app)
      .post('/api/calculation/getGrossSalary')
      .send({
        "basicpay": 50000,
        "hra": 15000,
        "da": 10000,
        "lta": 0,
        "cityallowance": 0,
        "miscellaneous": 0,
        "monthlybonus": 0,
        "quaterlybonus": 0,
        "annualbonus": 0
      })
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body).to.have.property('status', 'success');
    expect(res.body.data).to.have.property('grossMonthlySalary', 75000);
    expect(res.body.data).to.have.property('grossAnnualSalary', 900000);
  });

  it('should return error if basic salary is not provided', async () => {
    const res = await request(app)
      .post('/api/calculation/getGrossSalary')
      .send({
        "hra": 0,
        "da": 0,
        "lta": 0,
        "cityallowance": 0,
        "miscellaneous": 0,
        "monthlybonus": 0,
        "quaterlybonus": 0,
        "annualbonus": 0
      })
      .set('Accept', 'application/json')
      .expect(400);

    expect(res.text).to.equal('Error validating request body. "basicpay" is required.');
  });
});

describe('POST /newRegime/getTaxableIncome', () => {
  it('should return the correct taxable income', async () => {
    const data = {
      "incomeForm": {
        "basicpay": 10000,
        "hra": 0,
        "da": 0,
        "lta": 0,
        "cityallowance": 0,
        "miscellaneous": 0,
        "monthlybonus": 0,
        "quaterlybonus": 0,
        "annualbonus": 0
      },
      "deductionForm": {
        "section80C": {
          "ppf": 0,
          "elss": 0,
          "others": 0
        },
        "nps": 0,
        "section80D": {
          "yourParentsAge": true,
          "parentsHIS": 0,
          "selfHIS": 0
        },
        "section80G": 0
      },
      "exemptionForm": {
        "salaryComponents": {
          "hra": 0,
          "lta": 0
        }
      }
    };
    const res = await request(app)
      .post('/api/calculation/newRegime/getTaxableIncome')
      .send(data)
      .set('Accept', 'application/json')
      .expect(200);

    console.log(res.text);

    expect(res.body).to.have.property('status', 'success');
    expect(res.body.data).to.have.property('Taxable Income', 70000);
  });
});
