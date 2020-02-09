const restify = require('restify');
const config = require('./config');
const mongoose = require('mongoose');

const server = restify.createServer();

//Middleware
server.use(restify.plugins.bodyParser())

server.listen(config.PORT, ()=> {
    console.log('Server is up and running on port ' + config.PORT);
    mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true})
})

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    require('./routes/customer')(server);
    require('./routes/user')(server);
})


