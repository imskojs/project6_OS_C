(function() {
  'use strict';

  angular.module('app', [
    'ionic',
    'applicat.push.service',
    'ngCordova',
    'ngResource',
    'ngTemplates',
    'ngStorage',
    'ngFileUpload',
    'ngGeolocation'
  ])

  .run([
    '$ionicPlatform', '$rootScope', '$state', '$window', '$ionicHistory',
    'Message', 'rootScopeService', 'appStorage', 'devMode', 'PushService',

    function(
      $ionicPlatform, $rootScope, $state, $window, $ionicHistory,
      Message, rootScopeService, appStorage, devMode, PushService
    ) {

      angular.extend($rootScope, rootScopeService);
      $ionicPlatform.ready(onIonicPlatformReady);
      if (devMode) {
        setInitialState();
      }
      //====================================================
      //  Implementation
      //====================================================
      function onIonicPlatformReady() {
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
          $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ($window.StatusBar) {
          $window.StatusBar.styleDefault();
        }
        if ($window.cordova) {
          PushService.registerDevice();
        }
        $ionicPlatform.registerBackButtonAction(function(e) {
          e.preventDefault();
          if ($rootScope.areStates([
            'main.productList.market',
            'main.productList.pawnShop',
            'main.walkThrough',
            'main.login'
          ])) {
            return ionic.Platform.exitApp();
          }
          $ionicHistory.goBack();
        }, 101);
        setInitialState();
      }
      //====================================================
      //  Helper
      //====================================================
      function setInitialState() {
        // Set default current location
        appStorage.address = '전체보기';
        if (!appStorage.geoJSON) {
          appStorage.geoJSON = {
            type: 'Point',
            coordinates: [127.02800027507125, 37.498085435791786] // default 강남역.
          };
          appStorage.marketDistance = 30000;
          appStorage.pawnShopDistance = 30000;
        }
        if ($rootScope.appStorage.firstTime && $state.get('main.walkThrough')) {
          $state.go('main.walkThrough');
        } else if (!$rootScope.appStorage.token) {
          $state.go('main.login');
        } else {
          $state.go('main.productList.pawnShop', {
            // $state.go('main.announcementList', {
            category: 'pawnShop',
            status: 'responded',
            product: '',
            to: '',
            method: 'create',
            id: '',
            step: 2
          });
        }
      }
    }
  ])

  .config(['$stateProvider', '$httpProvider',
    function($stateProvider, $httpProvider) {

      // $ionicConfigProvider.scrolling.jsScrolling(false);
      // //Security handler
      $httpProvider.interceptors.push('AuthInterceptor');

      // //Allow session
      // $httpProvider.defaults.withCredentials = true;

      $stateProvider

      .state('main', {
        url: '/main',
        templateUrl: 'state/00main/main.html',
        controller: 'MainController as Main'
      })

      .state('main.walkThrough', {
        url: '/walkThrough',
        views: {
          main: {
            templateUrl: 'state/01walkThrough/walkThrough.html',
            controller: 'WalkThroughController as WalkThrough'
          }
        }
      })

      .state('main.login', {
        url: '/login',
        views: {
          main: {
            templateUrl: 'state/02login/login.html',
            controller: 'LoginController as Login'
          }
        }
      })

      .state('main.signUp', {
        params: {
          category: ''
        },
        url: '/signUp',
        views: {
          main: {
            templateUrl: 'state/02signUp/signUp.html',
            controller: 'SignUpController as SignUp'
          }
        }
      })

      .state('main.resetPassword', {
        params: {
          category: ''
        },
        url: '/resetPassword',
        views: {
          main: {
            templateUrl: 'state/02resetPassword/resetPassword.html',
            controller: 'ResetPasswordController as ResetPassword'
          }
        }
      })

      .state('main.profile', {
        params: {
          category: '',
          id: ''
        },
        url: '/profile',
        views: {
          main: {
            templateUrl: 'state/03profile/profile.html',
            controller: 'ProfileController as Profile'
          }
        }
      })

      .state('main.customer', {
        url: '/customer',
        views: {
          main: {
            templateUrl: 'state/04customer/customer.html',
            controller: 'CustomerController as Customer'
          }
        }
      })

      .state('main.term', {
        url: '/term',
        views: {
          main: {
            templateUrl: 'state/04term/term.html',
            controller: 'TermDetailController as TermDetail'
          }
        }
      })

      .state('main.home', {
        url: '/home',
        views: {
          main: {
            templateUrl: 'state/09home/home.html',
            controller: 'HomeController as Home'
          }
        }
      })

      .state('main.bidListUser', {
        params: {
          category: 'user',
          product: ''
        },
        url: '/bidListUser',
        views: {
          main: {
            templateUrl: 'state/10bidList/user/bidListUser.html',
            controller: 'BidListUserController as BidListUser'
          }
        }
      })

      .state('main.bidDetailUser', {
        params: {
          id: ''
        },
        url: '/bidDetailUser',
        views: {
          main: {
            templateUrl: 'state/10bidDetail/user/bidDetailUser.html',
            controller: 'BidDetailUserController as BidDetailUser'
          }
        }
      })


      .state('main.bidListPawnShopPending', {
        params: {
          category: 'pawnShop',
          status: 'pending'
        },
        url: '/bidListPawnShopPending',
        views: {
          main: {
            templateUrl: 'state/10bidList/pawnShop/pending/bidListPawnShopPending.html',
            controller: 'BidListPawnShopPendingController as BidListPawnShopPending'
          }
        }
      })

      .state('main.bidDetailPawnShopPending', {
        params: {
          id: ''
        },
        url: '/bidDetailPawnShopPending',
        views: {
          main: {
            templateUrl: 'state/10bidDetail/pawnShop/pending/bidDetailPawnShopPending.html',
            controller: 'BidDetailPawnShopPendingController as BidDetailPawnShopPending'
          }
        }
      })

      .state('main.bidListPawnShopResponded', {
        params: {
          category: 'pawnShop',
          status: 'responded'
        },
        url: '/bidListPawnShopResponded',
        views: {
          main: {
            templateUrl: 'state/10bidList/pawnShop/responded/bidListPawnShopResponded.html',
            controller: 'BidListPawnShopRespondedController as BidListPawnShopResponded'
          }
        }
      })

      .state('main.bidDetailPawnShopResponded', {
        params: {
          id: ''
        },
        url: '/bidDetailPawnShopResponded',
        views: {
          main: {
            templateUrl: 'state/10bidDetail/pawnShop/responded/bidDetailPawnShopResponded.html',
            controller: 'BidDetailPawnShopRespondedController as BidDetailPawnShopResponded'
          }
        }
      })

      // .state('main.bidRespond', {
      //   params: {
      //     id: ''
      //   },
      //   url: '/bidRespond',
      //   views: {
      //     main: {
      //       templateUrl: 'state/10bidRespond/bidRespond.html',
      //       controller: 'BidRespondController as BidRespond'
      //     }
      //   }
      // })

      .state('main.favoriteProductList', {
        url: '/favoriteProductList',
        views: {
          main: {
            templateUrl: 'state/10favoriteProductList/favoriteProductList.html',
            controller: 'FavoriteProductListController as FavoriteProductList'
          }
        }
      })

      .state('main.favoriteProductDetail', {
        url: '/favoriteProductDetail',
        views: {
          main: {
            templateUrl: 'state/10favoriteProductDetail/favoriteProductDetail.html',
            controller: 'FavoriteProductDetailController as FavoriteProductDetail'
          }
        }
      })

      .state('main.myProductListUser', {
        params: {
          category: 'user'
        },
        url: '/myProductListUser',
        views: {
          main: {
            templateUrl: 'state/10myProductList/user/myProductListUser.html',
            controller: 'MyProductListUserController as MyProductListUser'
          }
        }
      })

      .state('main.myProductListPawnShop', {
        params: {
          category: 'pawnShop'
        },
        url: '/myProductListPawnShop',
        views: {
          main: {
            templateUrl: 'state/10myProductList/pawnShop/myProductListPawnShop.html',
            controller: 'MyProductListPawnShopController as MyProductListPawnShop'
          }
        }
      })

      .state('main.productList', {
        abstract: true,
        url: '/productList',
        views: {
          main: {
            templateUrl: 'state/10productList/productList.html',
            controller: 'ProductListController as ProductList'
          }
        }
      })
        .state('main.productList.market', {
          params: {
            category: '', // pawnShop, market
            id: ''
          },
          url: '/market',
          views: {
            productList: {
              templateUrl: 'state/10productList/market/market.html',
              controller: 'ProductListController as ProductList'
            }
          }
        })
        .state('main.productList.pawnShop', {
          params: {
            category: '', // market,pawnShop
            id: ''
          },
          url: '/pawnShop',
          views: {
            productList: {
              templateUrl: 'state/10productList/pawnShop/pawnShop.html',
              controller: 'ProductListController as ProductList'
            }
          }
        })
        .state('main.placeId', {
          params: {
            category: '', // market,pawnShop
            id: ''
          },
          url: '/placeId',
          views: {
            main: {
              templateUrl: 'state/10productList/placeId/placeId.html',
              controller: 'ProductListController as ProductList'
            }
          }
        })



      .state('main.productRegister', {
        abstract: true,
        url: '/productRegister',
        views: {
          main: {
            templateUrl: 'state/10productRegister/productRegister.html',
            controller: 'ProductRegisterController as ProductRegister'
          }
        }
      })
        .state('main.productRegister.step1', {
          params: {
            category: '',
            step: '',
            id: '',
            method: ''
          },
          url: '/step1',
          views: {
            productRegister: {
              templateUrl: 'state/10productRegister/content/step1.html',
              controller: 'ProductRegisterController as ProductRegister'
            }
          }
        })
        .state('main.productRegister.step2', {
          params: {
            category: '',
            step: '',
            id: '',
            method: ''
          },
          url: '/step2',
          views: {
            productRegister: {
              templateUrl: 'state/10productRegister/content/step2.html',
              controller: 'ProductRegisterController as ProductRegister'
            }
          }
        })







      .state('main.productUpdate', {
        abstract: true,
        url: '/productUpdate',
        views: {
          main: {
            templateUrl: 'state/10productUpdate/productUpdate.html',
            controller: 'ProductUpdateController as ProductUpdate'
          }
        }
      })
        .state('main.productUpdate.info', {
          params: {
            category: '',
            step: '',
            section: 'info',
            id: '',
            method: ''
          },
          url: '/info',
          views: {
            productUpdate: {
              templateUrl: 'state/10productUpdate/info/productUpdateInfo.html',
              controller: 'ProductUpdateInfoController as ProductUpdateInfo'
            }
          }
        })
        .state('main.productUpdate.photo', {
          params: {
            category: '',
            step: '',
            section: 'photo',
            id: '',
            method: ''
          },
          url: '/photo',
          views: {
            productUpdate: {
              templateUrl: 'state/10productUpdate/photo/productUpdatePhoto.html',
              controller: 'ProductUpdatePhotoController as ProductUpdatePhoto'
            }
          }
        })








      .state('main.productDetail', {
        abstract: true,
        url: '/productDetail',
        views: {
          main: {
            templateUrl: 'state/10productDetail/productDetail.html',
            controller: 'ProductDetailController as ProductDetail'
          }
        }
      })
        .state('main.productDetail.market', {
          params: {
            category: '',
            id: ''
          },
          url: '/market',
          views: {
            productDetail: {
              templateUrl: 'state/10productDetail/market/market.html',
              controller: 'ProductDetailController as ProductDetail'
            }
          }
        })
        .state('main.productDetail.pawnShop', {
          params: {
            category: '',
            id: ''
          },
          url: '/pawnShop',
          views: {
            productDetail: {
              templateUrl: 'state/10productDetail/pawnShop/pawnShop.html',
              controller: 'ProductDetailController as ProductDetail'
            }
          }
        })

      .state('main.postList', {
        params: {
          category: ''
        },
        url: '/postList',
        views: {
          main: {
            templateUrl: 'state/11postList/postList.html',
            controller: 'PostListController as PostList'
          }
        }
      })

      .state('main.postDetail', {
        params: {
          id: ''
        },
        url: '/postDetail',
        views: {
          main: {
            templateUrl: 'state/11postDetail/postDetail.html',
            controller: 'PostDetailController as PostDetail'
          }
        }
      })

      .state('main.announcementList', {
        params: {
          category: ''
        },
        url: '/announcementList',
        views: {
          main: {
            templateUrl: 'state/12announcementList/announcementList.html',
            controller: 'AnnouncementListController as AnnouncementList'
          }
        }
      })

      .state('main.announcementDetail', {
        params: {
          category: '',
          id: ''
        },
        url: '/announcementDetail',
        views: {
          main: {
            templateUrl: 'state/12announcementDetail/announcementDetail.html',
            controller: 'AnnouncementDetailController as AnnouncementDetail'
          }
        }
      })

      .state('main.faqList', {
        params: {
          category: ''
        },
        url: '/faqList',
        views: {
          main: {
            templateUrl: 'state/12faqList/faqList.html',
            controller: 'FaqListController as FaqList'
          }
        }
      })

      .state('main.faqDetail', {
        params: {
          category: '',
          id: ''
        },
        url: '/faqDetail',
        views: {
          main: {
            templateUrl: 'state/12faqDetail/faqDetail.html',
            controller: 'FaqDetailController as FaqDetail'
          }
        }
      })

      .state('main.placeList', {
        params: {
          category: ''
        },
        url: '/placeList',
        views: {
          main: {
            templateUrl: 'state/19placeList/placeList.html',
            controller: 'PlaceListController as PlaceList'
          }
        }
      })

      .state('main.placeDetail', {
        params: {
          id: ''
        },
        url: '/placeDetail',
        views: {
          main: {
            templateUrl: 'state/19placeDetail/placeDetail.html',
            controller: 'PlaceDetailController as PlaceDetail'
          }
        }
      })

      .state('main.daumMap', {
        params: {
          prev: '',
          id: ''
        },
        url: '/daumMap',
        views: {
          main: {
            templateUrl: 'state/20daumMap/daumMap.html',
            controller: 'DaumMapController as DaumMap'
          }
        }
      });
    } //END
  ]);

})();
