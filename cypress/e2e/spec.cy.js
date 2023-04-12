const getDetails = () => {
    cy.request({
        method: 'GET',
        url: 'http://localhost:30256/health',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: null
    }).as('details');
    return cy.get('@details');
}

const getCount = () => {
   return cy.request({
        method: 'GET',
        url: 'http://localhost:30256/count',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: null
    }).then(x => x.body.count);

}


describe('spec.cy.js', () => {
    it('should return 200OK for health status', ()=> {
      getDetails().its('status').should('eq', 200);
  })

    it('should be able record BP', ()=> {
        let newEmail = `${Date.now()}@aharitest.com`;
        let postReading = (email, systolic, diastolic, category) =>{
            return cy.request({
                method: 'POST',
                url: 'http://localhost:30256/',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: {
                    email: email,
                    systolic:  systolic,
                    diastolic:  diastolic,
                    category: category
                }
            });
        }
          postReading(newEmail, 123, 99, "High");
          postReading(newEmail, 123, 89, "Normal");
           postReading(newEmail, 123, 80, "PreHigh");
           getCount().should('eq', 3);
    })
})
