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
  // destructuring
  const {
    designer,
    railwayCompany,
    startYear,
    endYear,
    decade,
    wheelbase,
    wikiUrl,
    imageUrl,
    description,
  } = req.body;

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
const updateEngine = async (req, res) => {
  // console.log params :engineId
  console.log(req.params.engineId);
  // find the engine
  const newContent = {
    designer: req.body.designer,
    railwayCompany: req.body.railwayCompany,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    decade: req.body.decade,
    wheelbase: req.body.wheelbase,
    wikiUrl: req.body.wikiUrl,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  };

  try {
    const loco = await engineModel
      .findOneAndUpdate({ _id: req.params.engineId }, newContent);
    res.status(200).json({
      message: 'Successfully updated',
    });
  } catch(err) {
    res.json({
      message: `${err}: Database update error`
    });
  }
};

/***
 * Delete one engine
 * 
 * takes an id, deletes that id
 */
const deleteEngine = async (req, res) => {
  try {
    const loco = await engineModel
      .deleteOne({ _id: req.params.engineId });
    res.status(200).json({
      message: 'Successfully deleted that locomotive',
    });
  } catch(err) {
    res.json({
      message: `${err}: Database delete error`
    });
  }
};

module.exports = { getAllEngines, addEngine, updateEngine, deleteEngine };
