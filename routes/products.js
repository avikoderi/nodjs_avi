const express = require("express");
const { auth } = require("../middlewares/auth");
const { ProductModel, validateProduct } = require("../models/productModel");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;
    try {
        let data = await ProductModel.find({})

            .limit(Number(perPage))
            .skip(page * perPage)
        res.json(data);
        //   res.json("products work");
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

})

router.get("/price", async (req, res) => {
    let max = req.query.max || 9999;
    let min = req.query.min || 0;
    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;
    try {
        let data = await ProductModel.find({ $and: [{ price: { $lte: max } }, { price: { $gte: min } }] })
        .limit(Number(perPage))
        .skip(page * perPage)
        res.json(data);

    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get("/search", async (req, res) => {
    let searchQ = req.query.s;
    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;

    let searchRegExp = new RegExp(searchQ, "i")
    try {
        let data = await ProductModel.find
            ({
                $or: [{ name: searchRegExp }, { info: searchRegExp },
                { category: searchRegExp }, { price: searchRegExp },
                { cal: searchRegExp },]
            })
            .limit(Number(perPage))
            .skip(page * perPage)

        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})


router.get("/cat/:catname", async (req, res) => {
    let catname = req.params.catname;

    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;
    try {
        let data = await ProductModel.find({ category: catname })
            .limit(Number(perPage))
            .skip(page * perPage)
        res.json(data);

    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validateProduct(req.body);
    try {
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        let product = new ProductModel(req.body);
        products.user_id = req.tokenData._id;
        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.put("/:idProduct", auth, async (req, res) => {
    let idProduct = req.params.idProduct;
    let validBody = validateProduct(req.body);

    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let data = await ProductModel.updateOne({
            _id: idProduct, user_id: req.tokenData._id
        }, req.body);
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.delete("/:idProduct", auth, async (req, res) => {
    let idProduct = req.params.idProduct;
    let data = await ProductModel.deleteOne({
        _id: idProduct, user_id: req.tokenData._id
    });
    res.json(data)
});



module.exports = router;