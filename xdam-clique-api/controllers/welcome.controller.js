const {Router} = require('express');

const router = Router();


router.get('/', (req, res) => {
    res.send('Hello, World!');
});

router.get('/:name', (req, res) => {
    let { name } = req.params;
    res.send(`Hello, ${name}`);
});


module.exports = router;
