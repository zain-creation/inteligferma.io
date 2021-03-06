(function (app) {
  'use strict';

  app.registerModule('parcels', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('parcels.backoffice', ['core.admin','mdColorPicker','nemLogging','ui-leaflet']);
  app.registerModule('parcels.backoffice.routes', ['core.admin.routes']);
  app.registerModule('parcels.services');
  app.registerModule('parcels.routes', ['ui.router', 'core.routes', 'parcels.services']);
}(ApplicationConfiguration));
