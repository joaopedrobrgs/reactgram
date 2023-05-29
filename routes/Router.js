const express = require('express');
const router = express();

//Importando/Utilizando rota Users para toda a aplicação:
router.use("/api/users", require("./UserRoutes"))

router.post('/', (req, res) => {
   res.send(JSON.stringify(req.body))
})

module.exports = router;