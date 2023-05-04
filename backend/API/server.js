const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
   res.send("Hello, AfterAcademy");
});

app.listen(port, () => {
   console.log(`Server is up at ${port}`);
});