/* jshint ignore:start */
Users.register({}, SignUpModel.form).$promise;
userForm: {
  nickname: 'string',
  email: 'string',
  username: 'string === email',
  role: 'user'
}

Users.registerPlaceOwner({}, SignUpModel.form).$promise;
placeForm: {
  role: 'pawnShop',
  name: '점포명',
  email: 'string',
  cellPhone: integer,
  phone: integer,
  companyNumber: 'string',
  address: 'string',
  geoJSON: {
    Type: 'Point',
    coordinates: [longitude, latitude]
  }
}
return Bids.find({
  owner: appStorage.place.owner,
  limit: 10,
  status: 'pending', // 'responded'
  sort: 'id DESC', // 'updatedAt DESC'
  populates: ['photos', 'createdBy']
}).$promise

return Bids.findById({
  id: $stateParams.id,
  populates: 'createdBy,place,product'
}).$promise

return Bids.findOne({
  id: params.id,
  populates: ['photos', 'createdBy']
}).$promise;

return Bids.updateBid({
  id: $stateParams.id,
}, BidRespondModel.form).$promise

promise = Places.getPlace({
  id: params.id,
  populates: ['photos']
}).$promise

return Products.getProductsWithin({
    category: params.category,
    longitude: appStorage.geoJSON.coordinates[0],
    latitude: appStorage.geoJSON.coordinates[1],
    distance: appStorage.marketDistance,
    status: 'selling',
    limit: 10,
    populates: ['photos', 'place']
  }).$promise
  .then(onData);

return Products.getProducts({
  category: params.category,
  showBid: true,
  limit: 10,
  sort: 'id DESC',
  populates: ['photos']
}).$promise

Products.getProducts({
  place: params.id,
  category: params.category,
  limit: 10,
  sort: 'id DESC',
  populates: ['photos']
}).$promise

Products.getProduct({
  id: params.id,
  populates: ['photos', 'place']
}).$promise

// My Product List
Products.getProducts({
  createdBy: appStorage.user.id,
  category: 'pawnShop', //market
  limit: 10,
  sort: 'id DESC',
  populates: ['photos']
}).$promise


//====================================================
//  Create product By User
//====================================================
return ImageService.post({
  url: '/product/byUser',
  dataUris: ProductRegisterModel.dataUris,
  fields: ProductRegisterModel.form
})
files: [],
ProductByUserform: {
  name: null,
  productCategory: null,
  category: 'pawnShop',
  status: 'pending', // 'responded'
  brand: null,
  geoJSON: {},
  boughtAt: null,
  price: null,
  condition: null,
  showBid: true,
  description: null,
},

//====================================================
//  Create product By pawnShop
//====================================================
return ImageService.post({
  url: '/product',
  dataUris: ProductRegisterModel.dataUris,
  fields: ProductRegisterModel.form
})
files: [],
ProductByPlaceform: {
  place: placeId
  geoJSON: {},
  name: null,
  productCategory: null,
  status: 'selling' // 'sold'
  category: 'market',
  status: 'pending',
  brand: null,
  boughtAt: null,
  price: null,
  condition: null,
  // showBid: null,
  description: null,
},

return Posts.findOne({
  id: $state.params.id
}).$promise

return Posts.find({
  category: 'faq', // 'notification'
  limit: 20,
  sort: 'id DESC'
}).$promise

return ImageService.post({
  url: '/product/byUser',
  dataUris: ProductRegisterModel.dataUris,
  fields: ProductRegisterModel.form
})




//====================================================
//  Update bids by pawnShop
//====================================================
return Bids.updateBid({
  id: $stateParams.id
}, form).$promise
form: {
  status: 'responded',
  price: null,
  monthlyInterest: null,
  duration: null,
  canPickUp: null
}
/* jshint ignore:end */
