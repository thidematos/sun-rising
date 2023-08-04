'use strict';
class Location {
  constructor(local, beach, lat, lng, id) {
    this.local = local;
    this.beach = beach;
    this.lat = lat;
    this.lng = lng;
    this.id = id;
  }

  pushToArray(array) {
    array.push(this);
  }
}
