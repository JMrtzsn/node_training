const {Datastore} = require('@google-cloud/datastore')

// Creates a client
const datastore = new Datastore({
    namespace: "default",
    projectId: "molnkul-269517",
})


//Util function for generating customer entities
function buildEntity(customer, customerKey) {
    const entity = {
        key: customerKey, data: [
            {
                name: 'created',
                value: new Date().toJSON(),
                excludeFromIndexes: false
            },
            {
                name: 'name',
                value: customer.name,
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

//Util function for generating customer entities
async function generateCustomers() {
    const mockCustomer = require("./data/MOCK_DATA.json")
    try {
        const customerKey = datastore.key('Customers')
        const customerEntities = [mockCustomer.map(customer => buildEntity(customer, customerKey))]
        await customerEntities.forEach(element => datastore.save(element))
    } catch (e) {
        throw new Error(e)
    }
}


async function getCustomers() {
    try {
        const query = datastore.createQuery('Customers').order('created')
        const [customers] = await datastore.runQuery(query)

        // Reassigning ID to properly display in requests
        customers.forEach(entity => {
            entity.id = entity[datastore.KEY].id
        })
        return customers
    } catch (e) {
        throw new Error(e)
    }
}

async function getCustomerBy(id) {
    const customerID = Number(id)
    try {
        const customerKey = datastore.key(['Customers', customerID])
        const query = await datastore.createQuery('Customers').filter('__key__', '=', customerKey).limit(1)
        let [customer] = await datastore.runQuery(query)

        // Reassigning ID to properly display in requests
        customer = customer[0]
        customer.id = customer[datastore.KEY].id
        return customer
    } catch (e) {
        throw new Error(e)
    }

}


module.exports = {getCustomers, getCustomerBy}