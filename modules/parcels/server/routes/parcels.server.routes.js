'use strict';

/**
 * Module dependencies
 */
var parcelsPolicy = require('../policies/parcels.server.policy'),
  parcels = require('../controllers/parcels.server.controller');

module.exports = function (app) {
  // Parcels collection routes
  app.route('/api/parcels').all(parcelsPolicy.isAllowed)
    .get(parcels.list)
    .post(parcels.create);

  // Single parcel routes
  app.route('/api/parcels/:parcelId').all(parcelsPolicy.isAllowed)
    .get(parcels.read)
    .put(parcels.update)
    .delete(parcels.delete);

  app.route('/api/ajax/parcels/delete/all').all(parcelsPolicy.isAllowed)
    .post(parcels.deleteAll);

  app.route('/api/ajax/parcels/startWith/:startWith').all(parcelsPolicy.isAllowed)
    .get(parcels.searchTokenParcels);


  app.route('/api/lazy/parcels').all(parcelsPolicy.isAllowed)
    .get(parcels.lazy);

  // Finish by binding the parcel middleware
  app.param('parcelId', parcels.parcelByID);
};
