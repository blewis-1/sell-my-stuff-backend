const Thing = require('../model/Thing');

const fs = require('fs');

exports.createThing = (req, res, next) => {
    req.body.thing = JSON.parse(req.body.thing);
    const url = req.protocol + '://' + req.get('host');

    const thing = new Thing({
        title: req.body.thing.title,
        description: req.body.thing.description,
        imageUrl: url + '/images/' + req.file.filename,
        price: req.body.thing.price,
        userId: req.body.thing.userId
    });
    thing.save()
        .then(() => { res.status(201).json({ 'message': 'Post created sucessfully' }); })
        .catch((error) => { res.status(400).json({ error: "Custom error to verify" }) });
}
exports.getSingleThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id, })
        .then((thing) => { res.status(200).json(thing); })
        .catch((error) => { res.status(404).json({ error: error }); });
}
exports.getAllThing = (req, res, next) => {
    Thing.find()
        .then((things) => { res.status(200).json(things); })
        .catch((error) => { res.status(500).json({ error: error }) });
}
exports.updateThing = (req, res, next) => {
    let thing = new Thing({ _id: req.params._id });

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        thing = new Thing({
            _id: req.params.id,
            title: req.body.thing.title,
            description: req.body.thing.description,
            imageUrl: url + '/images/' + req.file.filename,
            price: req.body.thing.price,
            userId: req.body.thing.userId
        });
    } else {
        thing = new Thing({
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            userId: req.body.userId
        });
    }


    Thing.updateOne({ _id: req.params.id }, thing)
        .then(() => res.status(201).json({ message: 'Update Successfully' }))
        .catch((error) => res.status(400).json({ error: error }));
}
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id }).then(
        (thing) => {
            const filename = thing.imageUrl.split('images/')[1];
            fs.unlink('images/' + filename, () => {
                // check if the thing is avaliable
                if (!thing) {
                    return res.status(401).json({ error: new Error('Not found.') });
                }
                // check if the user id is the same as the id passed from the auth.
                if (thing.userId !== req.auth.userId) {
                    return res.status(401).json({ error: new Error('Unauthorize.') });
                }
                // finally delete the thing 
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Deleted Successfully" }))
                    .catch((error) => res.send(400).json({ error: error }));
            })

        }
    );
}