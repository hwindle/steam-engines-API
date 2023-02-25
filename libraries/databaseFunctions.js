'use strict';
const mongoose = require('mongoose');

mongoose.set('strictQuery', false); // suppress dep. warning
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// steam engine schema
const engineSchema = new mongoose.Schema({
  designer: String,
  railwayCompany: String,
  startYear: String,
  endYear: String,
  decade: String,
  wheelbase: String,
  wikiUrl: String,
  imageUrl: String,
  description: String,
});

const engineModel = mongoose.model('engines', engineSchema);

function seedDatabase() {
  const chineseOne = new engineModel({
    designer: 'Colonel Kenneth Cantlie',
    railwayCompany: 'Chinese Government Railways',
    startYear: '1935',
    endYear: '1981',
    decade: '1930',
    wheelbase: '4-8-4',
    wikiUrl: 'https://collection.sciencemuseumgroup.org.uk/objects/co205814/chinese-government-railways-steam-locomotive-4-8-4-kf-class-no-7-steam-locomotive',
    imageUrl: './assets/engine_images/engine_01.jpg',
    description: 'Absolutely massive Chinese engine with a large cab.',
  });

  // save the document to the collection
  chineseOne.save();
}

const getAllEngines = (req, res) => {
  engineModel.find({}, function (error, engineArray) {
    if (error) {
      console.error('DB error: ' + error);
    } else {
      res.status(200).send(engineArray);
    }
  });
};

const addEngine = async (req, res) => {
  // empty values
  let cleanName = '';
  let cleanBrand = '';
  let cleanPrice = 0.0;
  let cleanImageUrl = '';
  let cleanDescr = '';
  // check req values
  if (
    !req.body.name ||
    !req.body.brand ||
    !req.body.price ||
    !req.body.imageUrl ||
    !req.body.description
  ) {
    return res
      .status(501)
      .send('One of name, brand, price, imageUrl or description is empty.');
  }
  // check name - spaces hypens a-z one or more
  const azString = new RegExp("[a-zA-Z' -_]+");
  if (azString.test(req.body.name.toString())) {
    cleanName = req.body.name.toString().trim();
  }
  // check brand
  if (azString.test(req.body.brand)) {
    cleanBrand = req.body.brand.toString().trim();
  }
  // check price
  if (typeof req.body.price === 'number') {
    cleanPrice = parseFloat(req.body.price);
  }
  // would check the url if it wasn't such an unusual url
  cleanImageUrl = req.body.imageUrl.toString();

  // replace some characters in description
  // take out special chars like ;$£ etc.
  cleanDescr = req.body.description.replace(azString, ' ');
  // create the model
  let newMakeup = await productModel.create({
    name: cleanName,
    brand: cleanBrand,
    price: cleanPrice,
    imageUrl: cleanImageUrl,
    description: cleanDescr,
  });
  // send all new makeup products to client
  // including one just added.
  productModel.find({}, function (error, makeupArray) {
    if (error) {
      console.error('DB error: ' + error);
    } else {
      res.status(200).send(makeupArray);
    }
  });
};

module.exports = { seedDatabase, getAllEngines };