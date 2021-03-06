'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  _ = require('lodash'),
  Parcel = db.parcel;

/**
 * Create a parcel
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;

  Parcel.create(req.body).then(function(parcel) {
    if (!parcel) {
      return res.send('users/signup', {
        errors: 'Could not create the parcel'
      });
    } else {
      return res.jsonp(parcel);
    }
  }).catch(function(err) {
    console.log('----------------------->');
    console.log(JSON.stringify(err));
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current parcel
 */
exports.read = function(req, res) {
  res.json(req.parcel);
};

/**
 * Update a parcel
 */
exports.update = function(req, res) {
  var parcel = req.parcel;
  var updatedAttr = _.clone(req.body);

  //delete the field that you want to protect from change
  updatedAttr = _.omit(updatedAttr,'id','user_id','user');

  parcel.updateAttributes(updatedAttr).then(function(parcel) {
    res.json(parcel);
  }).catch(function(err) {
    console.log(JSON.stringify(err));
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an parcel
 */
exports.delete = function(req, res) {
  var parcel = req.parcel;
  // Find the parcel
  Parcel.findById(parcel.id).then(function(parcel) {
    if (parcel) {
      parcel.update({deletedAt: Date.now()}).then(function() {
        return res.json(parcel);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the parcel'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Parcels
 */
exports.list = function(req, res) {
  Parcel.findAll({
    include: []
  }).then(function(parcels) {
    if (!parcels) {
      return res.status(404).send({
        message: 'No product found'
      });
    } else {
      res.json(parcels);
    }
  })
  .catch(function(err) {
    res.status(404).send({message:'Error fetching data'});
  });
};

/**
* lazy load from client
*/
exports.lazy= function(req,res){
  var limit= req.query.limit;
  var offset= (req.query.page-1)*limit;
  var column = req.query.order;
  var orderType='ASC';

  if(column.indexOf('-') != -1){
    orderType= 'DESC';
    column= column.replace('-','');
  }

  Parcel.findAndCountAll({
     order: column+' '+orderType,
     offset: offset,
     limit: limit,
     where:{deletedAt:{$eq: null}},
     include:[]
  })
  .then(function(result) {
    res.json(result);
  }).catch(function(err){
    console.log(err);
    if(err)
      res.json({count:0,rows:[]});
  });

};

/**
* delete all item
*/
exports.deleteAll= function(req,res){
  var itemsToDelete= req.body.itemsToDelete;

  Parcel.update({deletedAt: Date.now()},{ where: {id: {$in: itemsToDelete}}})
    .then(function(updatedRow){
      res.json({deletedRow:updatedRow})
    }).catch(function(err){
      res.status(404).send({message:"can't deleteing items!!"});
    });
}


exports.searchTokenParcels = function(req,res){
  var startWith = req.params.startWith;
  Parcel.findAll({attributes:['id','name'],where:{name: {$ilike:'%'+startWith+'%'}}})
    .then(function(parcels){
      res.json(parcels);
    }).catch(function(err){
      res.json([]);
    });
};

/**
 * Parcel middleware
 */
exports.parcelByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Parcel is invalid'
    });
  }

  Parcel.find({
    where: {
      id: id
    },
    include: [{
      model: db.user, attributes:['id','displayName']
    }
  ]
}).then(function(parcel) {
    if (!parcel) {
      return res.status(404).send({
        message: 'No parcel with that identifier has been found'
      });
    } else {
      req.parcel = parcel;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
