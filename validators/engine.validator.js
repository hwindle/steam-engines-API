const Joi = require('joi');

const engineSchema = Joi.object({
  designer: Joi.string().min(3).max(50).trim().required(),
  railwayCompany: Joi.string().min(3).max(50).trim().optional(),
  startYear: Joi.string().pattern(/^[0-9]+$/, 'year')
    .required(),
  endYear: Joi.string().pattern(/^[0-9]+$/, 'year')
  .required(),
  decade: Joi.string().pattern(/^[0-9]+$/, 'year')
  .required(),
  wheelbase: Joi.string().pattern(/^[2,4,6]-[2,4,6,8,10]-d{1}/, 'wheelbase 2-4-0').optional(),
  wikiUrl: Joi.string().uri().optional(),
  imageUrl: Joi.string().uri({
      allowRelative: true
    }).required(),
  description: Joi.string().max(500).replace(/[!;"@#\?\|\\/]+/, '').optional()
});

modules.export = { engineSchema };