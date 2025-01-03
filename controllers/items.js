const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi'); // Import Joi for validation

// Define validation schema with Joi
const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  available: Joi.boolean().required(),
  createdAt: Joi.date().default(Date.now)
});

/**
 * GET /items
 * Retrieve all items from the database.
 */
const getAll = async (req, res) => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
  try {
    const result = await mongodb.getDb().db().collection('items').find();
    const items = await result.toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
};

/**
 * GET /items/:id
 * Retrieve a single item by its ID.
 */
const getSingle = async (req, res) => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
  try {
    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('items').findOne({ _id: itemId });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
};

/**
 * POST /items
 * Create a new item in the database.
 */
const createItem = async (req, res) => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to fill out.',
        required: true,
         '@schema': {
          "type": "object", 
          "properties": {         
            "name": {
              "type": "string",
              "example": "part name"
            },
            "description": {
              "type": "string",
              "example": "a wonder in electronics"
            },
            "price": {
              "type": "number",
              "example": "20"
            },
            "available": {
              "type": "boolean",
              "example": "true"
            }
          },
          "required": "name"
        }
      }
    }
  */
  try {
    // Validate request body
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await mongodb.getDb().db().collection('items').insertOne(value);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Failed to create item.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the item.' });
  }
};

/**
 * PUT /items/:id
 * Update an existing item by its ID.
 */
const updateItem = async (req, res) => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
 /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to update.',
        required: true,
         '@schema': {
          "type": "object", 
          "properties": {         
            "name": {
              "type": "string",
              "example": "updated part name"
            },
            "description": {
              "type": "string",
              "example": "updated a wonder in electronics"
            },
            "price": {
              "type": "number",
              "example": "25"
            },
            "available": {
              "type": "boolean",
              "example": "false"
            }
          },
          "required": "name"
        }
      }
    }
  */
  try {
    const itemId = new ObjectId(req.params.id);

    // Validate request body
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await mongodb.getDb().db().collection('items').replaceOne({ _id: itemId }, value);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found or no changes made.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the item.' });
  }
};

/**
 * DELETE /items/:id
 * Delete an item by its ID.
 */
const deleteItem = async (req, res) => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
  try {
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('items').deleteOne({ _id: itemId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the item.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createItem,
  updateItem,
  deleteItem
};
