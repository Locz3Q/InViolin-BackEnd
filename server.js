require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoString = process.env.DATABASE_URL;
const routes = require('./server/routes/routes');

app.use('/api', routes);
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json())
// FIXME: Odkomentuj aby polaczyc sie z baza danych
mongoose.connect(mongoString);
const database = mongoose.connection;

app.set('port', process.env.PORT || 5000);

const start = async () => {
    
}

const server = app.listen(app.get('port'), () => {
    console.log(`Listening on ${ server.address().port }`);
});

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('DataBase connected');
})

app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "userTwo"]})
});