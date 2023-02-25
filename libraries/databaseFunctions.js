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
    wikiUrl:
      'https://collection.sciencemuseumgroup.org.uk/objects/co205814/chinese-government-railways-steam-locomotive-4-8-4-kf-class-no-7-steam-locomotive',
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
  // create the model
  let newEngine = await engineModel.create({
    designer,
    railwayCompany,
    startYear,
    endYear,
    decade,
    wheelbase,
    wikiUrl,
    imageUrl,
    description,
  });

  // send a message to client informing them that the engine has
  // been saved
  if (newEngine) {
    res.status(200).json({
      message: 'A steam locomotive has been saved',
      newObject: newEngine,
    });
  } else {
    res.json({
      message: 'The new engine has not been entered into the database',
    });
  }
};

/**
 * Update one engine
 */
const updateEngine = (req, res) => {
  // console.log params :engineId
  console.log(req.params.engineId);
};

module.exports = { getAllEngines, addEngine, updateEngine };
