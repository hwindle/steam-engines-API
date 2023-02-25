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
  // regexes
  // a-z with single spaces
  const azString = new RegExp('[a-zA-Z0-9 -&]+');
  // for matching years (4 digits).
  // const yearString = new RegExp('\d{4}');
  // for matching steam engine wheel nos.
  //const wheelsRegex = new RegExp('^[2,4,6]-[2,4,6,8,10]-d{1}'); 
  // URLs - use validator.js instead
  const urlRegex = new RegExp(
    'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)'
  ); 
  // two different picture formats
  const picRegex = new RegExp('.(jpe?g|png)$');
  // check req values
  if (
    !req.body.designer ||
    !req.body.startYear ||
    !req.body.decade ||
    !req.body.imageUrl
  ) {
    return res
      .status(501)
      .send(
        'Please fill in the designer, startYear, decade (e.g. 1920) and imageUrl.'
      );
  }

  let cleanDesigner = 'A victorian';
  if (azString.test(req.body.designer.toString())) {
    cleanDesigner = req.body.designer.toString().trim();
  }
  // check railway company e.g. GCR, MR
  let cleanRailwayComp = '';
  if (azString.test(req.body.railwayCompany)) {
    cleanRailwayComp = req.body.railwayCompany.toString().trim();
  }
  // years - casting a string to a number will result in NaN.
  let cleanStartYear = '1900';
  if ((req.body.startYear.length === 4) && 
    (Number(req.body.startYear) !== 'NaN')) {
    cleanStartYear = req.body.startYear.trim();
  }
  // end year defaults to the Beeching year
  let cleanEndYear = '1966';
  if ((req.body.endYear.length === 4) && 
  (Number(req.body.endYear) !== 'NaN')) {
    cleanEndYear = req.body.endYear.trim();
  }
  let cleanDecade = '1910';
  if ((req.body.decade.length === 4) && 
  (Number(req.body.decade) !== 'NaN')) {
    cleanDecade = req.body.decade.trim();
  }
  // wheel base
  // defaults to a small tank engine wheel base
  let cleanWheels = '2-4-0';
  if (req.body.wheelbase) {
    const wheelsArr = req.body.wheelbase.split('-');
    const frontWheels = parseInt(wheelsArr[0]);
    const drivingWheels = parseInt(wheelsArr[1]);
    const cabWheels = parseInt(wheelsArr[2]);
    if ((frontWheels % 2 !== 0 && frontWheels > 6) || 
      (drivingWheels % 2 !== 0 && drivingWheels > 12) ||
      (cabWheels % 2 !== 0 && cabWheels > 6)) {
      // set the wheels to reasonable defaults
      cleanWheels = '4-6-2'; 
    }
    cleanWheels = req.body.wheelbase.trim();
  }
  // urls
  let cleanWiki = 'https://en.wikipedia.org/wiki/Steam_engine';
  if (typeof req.body.wikiUrl === 'string') {
    cleanWiki = req.body.wikiUrl.trim();
  }
  // image
  // default steam loco pic
  let cleanImageUrl = './assets/engine_images/engine_01.jpg';
  if (picRegex.test(req.body.imageUrl)) {
    cleanImageUrl = req.body.imageUrl.trim();
  }
  // take out any special characters
  // default description text for if the user is
  // too lazy to enter a loco description.
  let cleanDescr = 'A steam locomotive of some sort.';
  if (req.body.description) {
    cleanDescr = req.body.description.replace('[!;"@#?|\\/', '');
  }
  // create the model
  let newEngine = await engineModel.create({
    designer: cleanDesigner,
    railwayCompany: cleanRailwayComp,
    startYear: cleanStartYear,
    endYear: cleanEndYear,
    decade: cleanDecade,
    wheelbase: cleanWheels,
    wikiUrl: cleanWiki,
    imageUrl: cleanImageUrl,
    description: cleanDescr,
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

module.exports = { getAllEngines, addEngine };
