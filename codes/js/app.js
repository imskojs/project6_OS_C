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
    'ngGeolocation',
    'pascalprecht.translate'
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
        // appStorage.address = '전체보기';
        appStorage.address = 'SEEALL';
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

  .config(['$stateProvider', '$httpProvider', '$translateProvider',
    function($stateProvider, $httpProvider, $translateProvider) {

      $httpProvider.interceptors.push('AuthInterceptor');

      $translateProvider
        .translations('ko', {
          LOGIN: '로그인',
          SIGNUP: '회원가입',
          LOOK_AROUND: '둘러보고 가입하기',
          SIGNUP_PAWNSHOP: '점포 가입요청',
          NICKNAME_INSERT: '닉네임 입력',
          INSERT_EMAIL: '이메일 입력',
          INSERT_PASSWORD: '비밀번호 입력',
          REINSERT_PASSWORD: '비밀번호 재입력',
          CHECK_DUPLICATE: '중복확인',
          PAWNSHOP_NAME: '점포명',
          EMAIL_ADDRESS: '이메일 주소',
          MOBILE_NUMBER: '핸드폰 번호',
          PHONE_NUMBER: '전화번호',
          COMPANY_NUMBER: '대부업등록번호',
          ADDRESS: '주소',
          SELECT_PLACE: '장소를 골라주세요',
          AGREE_TERMS: '약관 동의하기',
          READ_TERMS: '약관 보기',
          COMPLETE: '완료',
          SEARCH_PRODUCT_NAME: '물품명 검색',
          MARKET: '마켓',
          PAWNSHOP: '전당포',
          SET_LOCATION: '지역 재설정',
          REQUEST_BID: '견적 요청하기',
          SELLING_PRODUCT: '판매물품',
          NOTICE: '공지사항',
          FAQ: '자주 묻는 질문',
          CUSTOMER_CENTER: '고객센터',
          TERMS: '이용약관',
          LOGOUT: '로그아웃',
          MY_PROFILE: '내 프로필',
          PAWNSHOP_PROFILE: '상인 프로필',
          NICKNAME: '닉네임',
          EMAIL: '이메일',
          CHANGE_NICKNAME: '닉네임 변경',
          CHANGE_EMAIL: '이메일 변경',
          RESET_PASSWORD: '비밀번호 재설정',
          CUSTOMER_TEXT_ONE: '마켓이나 전당포 이용에 관한',
          CUSTOMER_TEXT_TWO: '문의사항이 있으시면 연락 바랍니다.',
          TITLE: '제목',
          CONTENT: '내용',
          ASK: '문의하기',
          RECEIEVED_BID: '받은견적',
          BID_REQUESTED_BY: '견적요청자',
          BID_REQUESTED_AT: '견적 요청일',
          BRAND: '브랜드',
          BOUGHT_AT: '구입시기',
          CONDITION: '상태',
          RECEIVED_BID_CONTENT: '받은 견적 내역',
          QUOTE: '견적서',
          PRICE: '금액',
          MONTHLY_INTEREST: '월이율',
          DURATION: '기간',
          MONTHS: '개월',
          CAN_PICKUP: '출장서비스 유무',
          SEND_BID: '견적보내기',
          WRITE_BID_TO_SEND: '보낼견적서를 작성해주세요',
          PICKUP_OK: '출장가능',
          PICKUP_NO: '출장불가능',
          SENT_BID_CONTENT: '보낸 견적 내역',
          SENT_BID: '보낸 견적',
          RECEIVED_REQUEST_BID: '요청받은 견적',
          REQUESTED_BY: '요청자',
          REQUESTED_AT: '요청일',
          DELETE: '삭제',
          MY_QUOTE: '내 견적서',
          DETAIL: '상세정보',
          CATEGORY: '품목',
          EXTRA_ORDINARY: '특이사항',
          CALL: '전화하기',
          PAWNSHOP_DETAIL: '업체정보',
          FAVORITE_CONTENT: '찜한 내역',
          CHANGE_STATUS: '상태변경',
          ONSALE: '판매중',
          SOLD: '판매완료',
          PRODUCT_DETAIL: '물품내역',
          CREATED_AT: '등록일',
          R18_TEXT: '미성년자는 전당포 방문시 \n 거래가 불가능함을 알려드립니다',
          NEXT: '다음',
          CANCEL: '취소',
          REGISTER_PRODUCT: '상품등록',
          UPDATE_PRODUCT: '상품수정',
          WRITE_PRODUCT_DETAIL: '제품 정보입력',
          UPDATE_PRODUCT_DETAIL: '제품 정보를 수정해주세요',
          REQUEST_FORM: '견적 요청서',
          PRODUCT_NAME: '제품명',
          SELECT_STATUS: '상태 선택',
          HIGH: '상',
          MID: '중',
          LOW: '하',
          SELECT_PUBLIC_BID: '견적서 공개선택',
          PUBLIC: '공개',
          PRIVATE: '비공개',
          WRITE_EXTRA_ORDINARY: '특이사항 입력',
          UPLOAD_PRODUCT_PHOTOS: '제품 사진등록.',
          FRONT_PHOTO: '전면 사진',
          SIDE_PHOTO: '측면 사진',
          PRODUCT_TAG: '일련번호(태그)',
          ALL_PARTS: '부속품 전체',
          BROKEN_PARTS: '파손부분',
          COMPLETED_BID_CREATION_TEXT: '견적등록이 완료되었습니다.\n 등록된 견적은 내 견적서에서\n 확인하실 수 있습니다.\n ',
          CONFIRM: '확인',
          PLEASE_WRITE_PROPERLY: '제품정보를 자세히 입력해야 \n 정확한 견적을 받을 수 있습니다. \n 다음 단계로 넘어 가시겠습니까?',
          RESET_LOCATION: '지역 재설정',
          SET_CURRENT_LOCATION: '현재 위치로 등록 하시겠습니까?',
          UPDATE_COMPLETE: '수정 완료',
          UPDATE_PRODUCT_PHOTOS: '사진재등록',
          NOTICE_SHORT: '공지',
          LOOK_MAP: '지도보기',
          PAWNSHOP_ADDRESS: '점포주소',
          OPENING_HOURS: '영업시간',
          HANDLING_PRODUCTS: '취급물품',
          LOOK: '보러가기',
          WRITE_REPLY: '답글쓰기',
          RECEIVER: '받는사람',
          COMMENT_CONTENT: '댓글내용',
          INFO: '알림',
          REQUEST_ACCOUNT_TERMINATION_TEXT: '탈퇴신청을 하시겠습니까?',
          THREE_DAYS_TO_TERMINATE_TEXT: '탈퇴 신청 후 3일이내 탈퇴처리를 해드립니다',
          REQUEST_TERMINATION: '탈퇴신청',
          SELECT_PROFILE_TEXT: '프로필을 설정해주세요',
          REQUIRED_INPUTS: '사진, 닉네임, 전화번호는 필수 등록 사항입니다',
          REQUIRE_LOGIN: '로그인이 필요한 메뉴입니다',
          LOGIN_TEXT: '로그인하기',
          CURRENT_PASSWORD: '현재 비밀번호',
          NEW_PASSWORD: '새로운 비밀번호',
          SEEALL: '전체보기',
          SMARTPHONE_TABLET: '스마트폰/테블릿',
          CAMERA: '카메라',
          JEWELRY: '귀금속',
          LAPTOP_DESKTOP: '노트북/데스크탑',
          SPORTS_LEISURE: '스포츠/레저',
          WATCH: '시계',
          BAG: '가방',
          CAR_MOTORCYCLE: '자동차/오토바이',
          INSTRUMENT: '악기',
          ETC: '기타'
        })
        .translations('vi', {
          LOGIN: 'đăng nhập',
          SIGNUP: 'Đăng ký',
          LOOK_AROUND: 'Lên đến xung quanh báo cáo',
          SIGNUP_PAWNSHOP: 'công ty Đăng ký',
          NICKNAME_INSERT: 'nhập nickname',
          INSERT_EMAIL: 'nhập email của bạn',
          INSERT_PASSWORD: 'mật khẩu',
          REINSERT_PASSWORD: 'lặp lại mật khẩu',
          CHECK_DUPLICATE: 'kiểm tra tính sẵn sàng',
          PAWNSHOP_NAME: 'cửa hàng Tên',
          EMAIL_ADDRESS: 'E -mail địa chỉ',
          MOBILE_NUMBER: 'Số điện thoại di động',
          PHONE_NUMBER: 'số điện thoại',
          COMPANY_NUMBER: 'Số đăng ký cho vay',
          ADDRESS: 'địa chỉ',
          SELECT_PLACE: 'Vui lòng chọn một vị trí',
          AGREE_TERMS: 'Đồng ý với các Điều khoản và Điều kiện',
          READ_TERMS: 'Xem Điều khoản và Điều kiện',
          COMPLETE: 'hoàn toàn',
          SEARCH_PRODUCT_NAME: 'Tìm kiếm mulpummyeong',
          MARKET: 'thị trường',
          PAWNSHOP: 'tiệm cầm đồ',
          SET_LOCATION: 'thiết lập lại địa phương',
          REQUEST_BID: 'Yêu cầu một Trích dẫn',
          SELLING_PRODUCT: 'hàng hóa bán',
          NOTICE: 'thông báo',
          FAQ: 'Câu hỏi thường gặp',
          CUSTOMER_CENTER: 'Liên hệ',
          TERMS: 'Điều khoản sử dụng',
          LOGOUT: 'Thoát',
          MY_PROFILE: 'Hồ sơ của tôi',
          PAWNSHOP_PROFILE: 'Trader hồ sơ',
          NICKNAME: 'biệt danh',
          EMAIL: 'E -mail',
          CHANGE_NICKNAME: 'thay đổi Nickname',
          CHANGE_EMAIL: 'thay đổi email',
          RESET_PASSWORD: 'Thiết lập lại mật khẩu của bạn',
          CUSTOMER_TEXT_ONE: 'Vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc về',
          CUSTOMER_TEXT_TWO: 'thị trường hoặc cầm đồ sử dụng bốn cao .',
          TITLE: 'vấn đề',
          CONTENT: 'Nội dung',
          ASK: 'Liên hệ',
          RECEIEVED_BID: 'Ai ước tính',
          BID_REQUESTED_BY: 'Trích Yêu Cầu',
          BID_REQUESTED_AT: 'Ngày Quote',
          BRAND: 'Thương hiệu',
          BOUGHT_AT: 'Thời điểm mua hàng',
          CONDITION: 'Gangtae',
          RECEIVED_BID_CONTENT: 'Ai ước tính lịch sử',
          QUOTE: 'Trích dẫn',
          PRICE: 'số tiền',
          MONTHLY_INTEREST: 'lãi suất hàng tháng',
          DURATION: 'thời gian',
          MONTHS: 'tháng',
          CAN_PICKUP: 'Hiện diện trong khuôn viên',
          SEND_BID: 'Gửi Quote',
          WRITE_BID_TO_SEND: 'Xin vui lòng gửi một báo bằng văn bản',
          PICKUP_OK: 'có thể đi du lịch',
          PICKUP_NO: 'đi du lịch không thể',
          SENT_BID_CONTENT: 'Trích Từ Lịch sử',
          SENT_BID: 'từ quote',
          RECEIVED_REQUEST_BID: 'Trích dẫn yêu cầu',
          REQUESTED_BY: 'nài nỉ',
          REQUESTED_AT: 'Yêu cầu một',
          DELETE: 'xóa',
          MY_QUOTE: 'báo giá của tôi',
          DETAIL: 'thêm thông tin',
          CATEGORY: 'mục',
          EXTRA_ORDINARY: 'Tính độc đáo',
          CALL: 'cuộc gọi',
          PAWNSHOP_DETAIL: 'thông tin doanh nghiệp',
          FAVORITE_CONTENT: 'Lịch sử Jjimhan',
          CHANGE_STATUS: 'thay đổi trạng thái',
          ONSALE: 'buôn bán',
          SOLD: 'bán hàng hoàn thành',
          PRODUCT_DETAIL: 'hàng hóa lịch sử',
          CREATED_AT: 'thêm',
          R18_TEXT: 'Người chưa thành niên sẽ thông báo \ n Đừng giao dịch khi khách cầm đồ',
          NEXT: 'kế tiếp',
          CANCEL: 'bị hủy bỏ',
          REGISTER_PRODUCT: 'Đăng ký sản phẩm',
          UPDATE_PRODUCT: 'chỉnh sửa mục',
          WRITE_PRODUCT_DETAIL: 'Nhập thông tin sản phẩm',
          UPDATE_PRODUCT_DETAIL: 'Xin hãy sửa đổi thông tin sản phẩm',
          REQUEST_FORM: 'Yêu cầu báo giá',
          PRODUCT_NAME: 'Tên sản phẩm',
          SELECT_STATUS: 'Chọn nhà nước',
          HIGH: 'cao',
          MID: 'ở giữa',
          LOW: 'thấp',
          SELECT_PUBLIC_BID: 'Trích dẫn lựa chọn công cộng',
          PUBLIC: 'phóng thích',
          PRIVATE: 'riêng',
          WRITE_EXTRA_ORDINARY: 'Đầu vào tính độc đáo',
          UPLOAD_PRODUCT_PHOTOS: 'Đăng ký sản phẩm hình ảnh',
          FRONT_PHOTO: 'Mặt ảnh',
          SIDE_PHOTO: 'ảnh Side',
          PRODUCT_TAG: 'Số serial (tag )',
          ALL_PARTS: 'phụ kiện đầy đủ',
          BROKEN_PARTS: 'phận bị hư hỏng',
          COMPLETED_BID_CREATION_TEXT: 'Đăng ký dự toán đã được hoàn thành. \n ước tính đăng kí có thể được tìm thấy \n trong dấu ngoặc kép.',
          CONFIRM: 'sự xác nhận',
          PLEASE_WRITE_PROPERLY: 'Thông tin sản phẩm lên phải nhập \n Bạn có thể nhận được một báo giá chính xác . \n bạn có muốn đi đến bước tiếp theo ?',
          RESET_LOCATION: 'thiết lập lại địa phương',
          SET_CURRENT_LOCATION: 'Bạn có muốn đăng ký vào vị trí hiện tại của bạn ?',
          UPDATE_COMPLETE: 'Sửa đổi hoàn',
          UPDATE_PRODUCT_PHOTOS: 'Ảnh đăng ký lại',
          NOTICE_SHORT: 'thông tin',
          LOOK_MAP: 'Xem bản đồ',
          PAWNSHOP_ADDRESS: 'Địa chỉ cửa hàng',
          OPENING_HOURS: 'giờ mở cửa',
          HANDLING_PRODUCTS: 'xử lý hàng hóa',
          LOOK: 'cái giỏ',
          WRITE_REPLY: 'trả lời Liên hệ',
          RECEIVER: 'Người nhận',
          COMMENT_CONTENT: 'Comment nhiều',
          INFO: 'thông báo',
          REQUEST_ACCOUNT_TERMINATION_TEXT: 'Bạn có chắc chắn muốn để lại các ứng dụng?',
          THREE_DAYS_TO_TERMINATE_TEXT: 'Sau đó, nó sẽ được áp dụng cho nghỉ việc để rút điều trị trong vòng 3 ngày',
          REQUEST_TERMINATION: 'rút Yêu cầu',
          SELECT_PROFILE_TEXT: 'Hãy thiết lập hồ sơ của bạn',
          REQUIRED_INPUTS: 'Hình ảnh, biệt hiệu, đăng ký số điện thoại là cần thiết',
          REQUIRE_LOGIN: 'Một đơn yêu cầu đăng nhập',
          LOGIN_TEXT: 'Đăng nhập',
          CURRENT_PASSWORD: 'mật khẩu hiện tại',
          NEW_PASSWORD: 'mật khẩu mới',
          SEEALL: 'Xem tất cả',
          SMARTPHONE_TABLET: 'Smartphone/Tablet',
          CAMERA: 'máy chụp ảnh',
          JEWELRY: 'Các kim loại quý',
          LAPTOP_DESKTOP: 'Laptop/Desktop',
          SPORTS_LEISURE: 'Thể thao/Giải trí',
          WATCH: 'đồng hồ',
          BAG: 'túi',
          CAR_MOTORCYCLE: 'xe hơi/xe đạp',
          INSTRUMENT: 'nhạc cụ',
          ETC: 'vân vân.'

        });
      $translateProvider.preferredLanguage('ko');

      // {{ 'PROPERTY' | translate }}
      // <button ng-click="test('de')" translate="BUTTON_TEXT_DE">

      // $translate.use('ko');


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
          // abstract: true,
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
          // abstract: true,
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
          // abstract: true,
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
          // abstract: true,
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
