const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
    // Get all Customers
    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({});
            res.send({data: customers})
            next()
        } catch (error) {
            return next(new errors.InvalidArgumentError(error))
        }
    });

    server.post('/customers', async (req, res, next) => {
        // check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json"))
        }
        const {name, email, balance} = req.body;

        const customer = Customer({ name, email, balance })

        try {
            const newCustomer = await customer.save()
            res.send(newCustomer);
        } catch (error) {
            return next(new errors.InternalServerError(error.message))
        }

    })

    // GET single Customer
    server.get('/customers/:customerId', async (req, res, next) => {
        try {
            const customer = await Customer.findById(req.params.customerId);
            res.send({data: customer})
            next()
        } catch (error) {
            return next(new errors.ResourceNotFoundError(`Customer dosent exist`))
        }
    });

    // Update a Customer
    server.put('/customers/:customerId', async (req, res, next) => {
        // check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json"))
        }
        try {
            const customer = await Customer.findOneAndUpdate({ _id: req.params.customerId }, req.body)
            res.send(customer);
        } catch (error) {
            return next(new errors.ResourceNotFoundError(error.message))
        }

    })

    server.del('/customers/:customerId', async (req, res, next) => {
        try {
            const deletedCustomer = await Customer.findByIdAndDelete(req.params.customerId)
            res.send(204);
            next();
        } catch (error) {
            return next(new errors.ResourceNotFoundError(error.message)) 
        }
    })
    

}