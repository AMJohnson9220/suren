class batchReport {
    constructor() {
        const batchSubmit = document.querySelector('.card-batch--submit')

        // submit click event
        if (batchSubmit != null) {
            batchSubmit.addEventListener('click', () => {
                // pass through batch number to query
                this.query(document.querySelector('#batchNumberCheck').value)
            })
        }
    }

    query(batchNumber) {
        // graphql query to find specific metaobject
        const batchQuery = `{
            metaobject(handle: {handle: "${batchNumber}", type: "batch"}) {
              fields {
                key
                value
                reference {
                  ... on GenericFile {
                    url
                  }
                }
              }
            }
          }`;

        fetch(`https://${window.Shopify.shop}/api/2023-04/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/graphql',
                'X-Shopify-Storefront-Access-Token': '54d0a05ab2674816730b616f224194a5'
            },
            body: batchQuery
        })
            .then(res => res.json())
            .then(res => this.buildReport(res))
            .catch(response => {
                document.querySelector('.card-batch--btn-container').innerHTML = this.reportSample()
                // console.log('response', response)
            })
    }

    buildReport(data) {
        const batch = data.data.metaobject.fields
        const title = batch[3].value
        const number = batch[1].value
        const description = batch[0].value
        const report = batch[2].reference.url

        document.querySelector('.card-batch--btn-container').innerHTML = this.reportItem(title, description, number, report)
    }

    reportItem(title, description, number, report) {
        const elem = `
            <div class="card-batch--report">
                <div class="title--secondary">${title} - ${number}</div>
                <div class="text">${description}</div>
                <a class="button button--blue" href="${report}" target="_blank">Download report</a>
            </div>`
        return elem
    }

    reportSample() {
        const elem = `
            <span class="text error">This batch number does not exist, please try again.</span>
            <span class="button button--blue-clear">View sample report</span>`
        return elem
    }
}

new batchReport();