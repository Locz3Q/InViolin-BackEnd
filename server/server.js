require('dotenv').config();

const app = require('../app');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoString = process.env.DATABASE_URI;
const teachersRoutes = require('./routes/teachers');
const studentsRoutes = require('./routes/students');

app.use('/api/teachers', teachersRoutes);
app.use('/api/students', studentsRoutes);
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json())
mongoose.connect(mongoString);
const database = mongoose.connection;

app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
    console.log(`Listening on ${ server.address().port }`);
});

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('DataBase connected');
})