const app = require('./app');
const mongoose = require('mongoose');

app.set('port', process.env.PORT || 5000);

const start = async () => {
    
}

const server = app.listen(app.get('port'), () => {
    console.log(`Listening on ${ server.address().port }`);
});

app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "userTwo"]})
});