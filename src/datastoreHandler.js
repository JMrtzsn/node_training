const {Datastore} = require('@google-cloud/datastore')
const util = require('util')
const debuglog = util.debuglog('datastoreHandler')

// Creates a client
const datastore = new Datastore({
    namespace: "default",
    projectId: "molnkul-269517",
})


function buildCustomer(customer, customerKey) {
    const entity = {
        key: customerKey, data: [
            {
                name: 'created',
                value: new Date().toJSON(),
            },
            {
                name: 'name',
                value: customer.name,
                excludeFromIndexes: false,
            },
            {
                name: 'email',
                value: customer.email,
            },
            {
                name: 'gender',
                value: customer.gender,
            },
            {
                name: 'upsell',
                value: customer.upsell,
            }, {
                name: 'subscription',
                value: customer.subscription,
            }

        ]
    }
    return entity
}

async function generateCustomers() {
    const mockCustomer = require("./data/MOCK_DATA.json")
    try {
        const customerKey = datastore.key('Customers')
        const customerEntities = [mockCustomer.map(customer => buildCustomer(customer, customerKey))]
        await customerEntities.forEach(element => datastore.save(element))
    } catch (e) {
        debuglog(e)
        throw Error(e)
    }
}

async function listCustomers() {
    try {
        const query = datastore.createQuery('Customers').order('created')
        const [customers] = await datastore.runQuery(query)
        return customers
    } catch (e) {
        debuglog(e)
        throw Error(e)
    }

}

async function getCustomer(id) {
    customerID = Number(4653195938758656)
    try {
        const query = datastore.createQuery('Customers').filter("name", "=", "Alair Cutmare").limit(1)
        const [customers] = await datastore.runQuery(query)
        return customers
    } catch (e) {
        debuglog(e)
        throw Error(e)
    }

}


module.exports = {listCustomers, generateCustomers, getCustomer}