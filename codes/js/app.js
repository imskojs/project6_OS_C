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
          ETC: '기타',


          IMAGE_ALERT: '이미지 알림',
          IMAGE_ALERT_MESSAGE: '이미지 불러오기 실패하였습니다. 갤러리에서 선택해주세요.',
          PHONE_CALL_ALERT: '전화걸기 알림',
          PLEASE_LOGIN: '로그인을 해주세요.',
          LOOK_AROUND_ALERT: '둘러보기 알림',
          LOGIN_REQUIRED: '로그인을 하셔야 보실수있는 내용입니다.',
          GPS_IS_OFF: '위치 공유가 꺼져있습니다.',
          TURN_ON_GPS: '위치 공유를 켜주세요.',
          CURRENT_LOCATION_ALERT: '현재위치 알림',
          CURRENT_LOCATION_SET: '현재위치로 장소가 설정되었습니다. 완료버튼을 눌러주세요.',
          SEARCH_ALERT: '검색하기 알림',
          INPUT_PLACE_VALUE: '장소 값을 넣어서 다시 검색해주세요',
          NO_PLACE_EXIST: '요청하신 장소가 없습니다.',
          SEARCH_AGAIN: '다시 검색해주세요.',
          PHOTO_REGISTER_ALERT: '사진등록 알림',
          REGISTER_FRONT_PHOTO: '전면사진을 먼저 등록해주세요.',
          REGISTER_SIDE_PHOTO: '측면사진을 먼저 등록해주세요.',
          REGISTER_TAG_PHOTO: '일련번호(태그)를 먼저 등록해주세요.',
          REGISTER_ALL_PARTS_PHOTO: '부속품 전체를 먼저 등록해주세요.',
          PRODUCT_UPDATE_SUCCESS: '상품이 성공적으로 수정되었습니다',
          MOVE_TO_MY_PRODUCT: '나의 상품목록으로 이동하겠습니다.',
          INTERNET_IS_OFF: '인터넷이 끊겼습니다.',
          TURN_ON_INTERNET: '인터넷을 켜주세요.',
          REGISTER_PRODUCT_ALERT: '상품등록 알림',
          INPUT_DELIVERY: '출장가능 여부를 입력해주세요.',
          INPUT_DURATION: '기간을 입력하세요',
          INPUT_PHONE: '핸드폰 번호를 입력해주세요.',
          INPUT_PRICE: '가격을 입력해주세요.',
          INPUT_PRODUCT_NAME: '제품명을 입력해주세요.',
          INPUT_PRODUCT_CATEGORY: '품목을 입력해주세요.',
          INPUT_BRAND: '브랜드를 입력해주세요.',
          INPUT_BOUGHTAT: '구입시기를 입력해주세요.',
          INPUT_CONDITION: '상태를 선택해 주세요.',
          INPUT_SHOW_BID: '견적서 공개여부를 선택해주세요',
          INPUT_EXTRA_ORDINARY: '특이사항을 입력해주세요.',
          INPUT_COMPANY_NUMBER: '대부업등록번호를 입력해주세요.',
          INPUT_ADDRESS: '주소를 입력해주세요',
          CHOOSE_ADDRESS: '주소를 검색하여 골라주세요.',
          SIGNUP_FAILED: '가입실패',
          REINPUT: '다시 입력해주세요.',
          RESET_PASSWORD_ALERT: '비밀번호변경 알림',
          EMAIL_PASSWORD_WRONG: '이메일이나 암호가 잘못 되었습니다.',
          INPUT_PAWNSHOPNAME: '점포명을 입력해주세요.',
          LOGIN_ALERT: '로그인 알림',
          INPUT_NICKNAME: '닉네임을 입력해주세요.',
          NICKNAME_4_REQUIRED: '닉네임은 4자 이상이여야합니다.',
          INPUT_EMAIL: '이메일을 입력해주세요.',
          CHECK_DUPLICATE_EMAIL: '이메일 중복확인을 해주세요.',
          INPUT_PASSWORD: '비밀번호를 입력해주세요.',
          REINPUT_PASSWORD: '비밀번호가 다릅니다 다시 입력해주세요.',
          ONLY_1_PHOTO: '사진을 최소한 1개이상 등록해주셔야합니다.',
          REGISTERATION_COMPLETE: '견적등록이 완료 되었습니다.',
          CONFIRM_AT_MY_BIDS: '등록된 견적은 내견적서에서 확인 하실수 있습니다.',
          THERE_IS_NO_PAWNSHOP: '주위에 전당포가 없습니다',
          RE_SELECT_PLACE: '지역을 다시 설정해주십시요',
          REGISTER_PRODUCT_COMPLETE: '상품이 성공적으로 등록되었습니다',
          REQUEST_BID_ALERT: '견적요청 알림',
          NORMAL_USER_REQUEST: '일반유저만 견적을 요청할수있습니다.',
          REFRESH_ALERT: '새로고침 알림',
          NO_PRODUCT_AROUND: '주위 상품이 없습니다',
          SEND_BID_ALERT: '견적보내기 알림',
          BID_SENT: '견적이 보내졌습니다.',
          CUSTOMER_CENTER_ALERT: '고객센터 알림',
          LOGIN_SIGNUP_NEEDED: '로그인/회원가입을 하셔야 합니다.',
          QUERY_SENT_WAIT_REPLY: '고객문의가 성공적으로 접수 되었습니다. 가입하신 이메일로 연락 드리겠습니다.',
          QUERY_ALERT: '고객문의 알림',
          TITLE_CONTENT_NEEDED: '제목과 내용은 필수 사항입니다.',
          PROFILE_UPDATE_ALERT: '프로필 수정 알림',
          DUPLICATE_PASSWORD: '비밀번호 중복확인 알림',
          AVAILABLE_EMAIL: '사용가능한 이메일 입니다.',
          NOT_AVAILABLE_EMAIL: '이미 사용중인 이메일 입니다.',
          USER_REGISTERATION_COMPLETE: '회원가입 성공',

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
        ETC: 'vân vân.',



        IMAGE_ALERT: 'hình ảnh Thông báo',
        IMAGE_ALERT_MESSAGE: 'Nó không để nhập hình ảnh. Vui lòng chọn từ thư viện.',
        PHONE_CALL_ALERT: 'Thông báo cuộc gọi',
        PLEASE_LOGIN: 'Hãy đăng nhập.',
        LOOK_AROUND_ALERT: 'Khám phá cảnh báo',
        LOGIN_REQUIRED: 'Vui lòng đăng nhập để xem nội dung.',
        GPS_IS_OFF: 'Chia sẻ vị trí không được bật.',
        TURN_ON_GPS: 'Hãy bật Location Sharing.',
        CURRENT_LOCATION_ALERT: 'Báo Vị trí hiện tại',
        CURRENT_LOCATION_SET: 'Các vị trí đến vị trí hiện tại đã được thiết lập. Xin vui lòng bấm vào nút Done.',
        SEARCH_ALERT: 'Tìm kiếm các cảnh báo',
        INPUT_PLACE_VALUE: 'Hãy tìm kiếm một lần nữa đặt giá trị nơi',
        NO_PLACE_EXIST: 'Không có nơi nào cho yêu cầu này.',
        SEARCH_AGAIN: 'Hãy tìm kiếm lại.',
        PHOTO_REGISTER_ALERT: 'Nhắc nhở ảnh đăng ký',
        REGISTER_FRONT_PHOTO: 'Vui lòng đăng ký trước hình ảnh của bạn đầu tiên.',
        REGISTER_SIDE_PHOTO: 'Vui lòng đăng ký bên hình ảnh của bạn đầu tiên.',
        REGISTER_TAG_PHOTO: 'Hãy đăng ký số serial của bạn (tag) đầu tiên.',
        REGISTER_ALL_PARTS_PHOTO: 'Vui lòng đăng ký phụ kiện đầy đủ đầu tiên.',
        PRODUCT_UPDATE_SUCCESS: 'Sản phẩm này đã được sửa đổi thành công',
        MOVE_TO_MY_PRODUCT: 'Tôi sẽ đi vào danh sách các mặt hàng.',
        INTERNET_IS_OFF: 'Internet đã được ngắt kết nối.',
        TURN_ON_INTERNET: 'Hãy biến trên Internet.',
        REGISTER_PRODUCT_ALERT: 'Nhắc nhở đăng ký sản phẩm',
        INPUT_DELIVERY: 'Vui lòng nhập sẵn có chuyến du lịch của bạn.',
        INPUT_DURATION: 'Nhập thời gian',
        INPUT_PHONE: 'Vui lòng nhập số điện thoại di động của bạn.',
        INPUT_PRICE: 'Vui lòng nhập giá.',
        INPUT_PRODUCT_NAME: 'Vui lòng nhập tên của bạn.',
        INPUT_PRODUCT_CATEGORY: 'Vui lòng nhập các mục.',
        INPUT_BRAND: 'Vui lòng nhập thương hiệu của bạn.',
        INPUT_BOUGHTAT: 'Vui lòng nhập thời điểm mua hàng.',
        INPUT_CONDITION: 'Vui lòng chọn trạng thái của bạn.',
        INPUT_SHOW_BID: 'Vui lòng chọn có tiết lộ quote',
        INPUT_EXTRA_ORDINARY: 'Vui lòng nhập tính độc đáo của bạn.',
        INPUT_COMPANY_NUMBER: 'Cho vay tiền xin vui lòng nhập số đăng ký của bạn.',
        INPUT_ADDRESS: 'Vui lòng nhập địa chỉ của bạn',
        CHOOSE_ADDRESS: 'Vui lòng chọn để tìm kiếm địa chỉ.',
        SIGNUP_FAILED: 'Đăng ký không thành',
        REINPUT: 'Vui lòng nhập lại.',
        RESET_PASSWORD_ALERT: 'Mật mã thông báo thay đổi',
        EMAIL_PASSWORD_WRONG: 'Email hoặc mật khẩu không đúng.',
        INPUT_PAWNSHOPNAME: 'Vui lòng nhập tên cửa hàng của bạn.',
        LOGIN_ALERT: 'Đăng nhập Thông báo',
        INPUT_NICKNAME: 'Vui lòng nhập nickname của bạn.',
        NICKNAME_4_REQUIRED: 'Biệt danh phải có ít nhất 4 ký tự.',
        INPUT_EMAIL: 'Vui lòng điền email của bạn.',
        CHECK_DUPLICATE_EMAIL: 'Vui lòng xác nhận bản sao email của bạn.',
        INPUT_PASSWORD: 'Vui lòng nhập mật khẩu.',
        REINPUT_PASSWORD: 'Vui lòng nhập một mật khẩu khác nhau một lần nữa.',
        ONLY_1_PHOTO: 'Tôi cần bạn phải đăng ký ít nhất một hoặc nhiều bức ảnh.',
        REGISTERATION_COMPLETE: 'Đăng ký trích này đã được hoàn thành.',
        CONFIRM_AT_MY_BIDS: 'Bạn có thể kiểm tra các báo đăng ký trong vòng một báo giá.',
        THERE_IS_NO_PAWNSHOP: 'Không có cửa hàng cầm đồ xung quanh',
        RE_SELECT_PLACE: 'Hãy thiết lập khu vực một lần nữa',
        REGISTER_PRODUCT_COMPLETE: 'Sản phẩm này đã được đăng ký thành công',
        REQUEST_BID_ALERT: 'Yêu cầu thông báo',
        NORMAL_USER_REQUEST: 'Chỉ người dùng thường xuyên có thể yêu cầu một báo giá.',
        REFRESH_ALERT: 'Thông báo Refresh',
        NO_PRODUCT_AROUND: 'Khoảng không có sản phẩm',
        SEND_BID_ALERT: 'Ước tính Thông báo được gửi',
        BID_SENT: 'Trích dẫn đã được gửi đi.',
        CUSTOMER_CENTER_ALERT: 'Cảnh báo MCC',
        LOGIN_SIGNUP_NEEDED: 'Hãy đăng nhập / đăng ký.',
        QUERY_SENT_WAIT_REPLY: 'Thắc mắc của khách hàng đã được nhận thành công. Chúng tôi sẽ liên lạc với bạn bằng cách thuê bao e-mail.',
        QUERY_ALERT: 'Liên hệ Thông báo',
        TITLE_CONTENT_NEEDED: 'Tiêu đề và nội dung được yêu cầu.',
        PROFILE_UPDATE_ALERT: 'Chỉnh sửa thông báo hồ sơ',
        DUPLICATE_PASSWORD: 'Lấy lại mật mã trùng lặp kiểm tra',
        AVAILABLE_EMAIL: 'Các email có sẵn.',
        NOT_AVAILABLE_EMAIL: 'Email đã được sử dụng.',
        USER_REGISTERATION_COMPLETE: 'Đăng ký thành công',

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
