// create the module and name it scotchApp
var dnApp = angular.module('dnApp', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngMessages']);


dnApp.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();
	
		return year + '/' + (monthIndex + 1) + '/' + day;
    };
});

// configure our routes
dnApp.config(function ($routeProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl: 'pages/login.html',
			controller: 'signinController'
		})

		// route for the booking page
		.when('/booking', {
			templateUrl: 'pages/booking.html',
			controller: 'bookingController'
		})

		// route for the order page
		.when('/order', {
			templateUrl: 'pages/order.html',
			controller: 'orderController'
		});

});

dnApp.factory('UserService', function () {
	return {
		signedin: 'N'
	};
});

// create the controller and inject Angular's $scope
dnApp.controller('menuController', function ($scope) {

});

// create the controller and inject Angular's $scope
dnApp.controller('bookingController', function ($scope, $rootScope, $http, $timeout, $cookies, $location, UserService) {
	
	$scope.errorMessage = false;

	$scope.userid = $cookies.get('userid');

	if ($scope.userid == undefined) {
		$location.path("/");
	}

	$scope.booking = function () {
		
		if ($scope.bkDate == undefined) {
			$scope.errorMessage = "Please input booking date!";
			return;
		} else {
            $scope.bkDate = $scope.bkDate.getFullYear() + '/' + ($scope.bkDate.getMonth() + 1) + '/' + $scope.bkDate.getDate();
        }

		$http({
			method: "GET",
			url: "php/booking.php",
			params: { bookingdate: $scope.bkDate }
		}).then(function mySuccess(response) {
			$scope.searchBooking = response.data;
            
		}, function myError(response) {
			$scope.searchBooking = response.status;
		});
	};

});

dnApp.controller('orderController', function ($scope, $rootScope, $http, $timeout, $cookies, $location, UserService) {
	$scope.errorMessage = false;

	$scope.userid = $cookies.get('userid');

	if ($scope.userid == undefined) {
		$location.path("/");
	}

	$scope.orders = function () {
		$scope.userid = $cookies.get('userid');

		if ($scope.userid == undefined) {
			$location.path("/");
			return;
		}

		if ($scope.bkDate == undefined) {
			$scope.errorMessage = "Please input booking date!";
			return;
		} else {
            $scope.bkDate = $scope.bkDate.getFullYear() + '/' + ($scope.bkDate.getMonth() + 1) + '/' + $scope.bkDate.getDate();
        }

		$http({
			method: "GET",
			url: "php/order.php",
			params: { orderdate: $scope.bkDate }
		}).then(function mySuccess(response) {
			$scope.searchOrders = response.data;
            
		}, function myError(response) {
			$scope.searchOrders = response.status;
		});
	};


});

dnApp.controller('signinController', function ($scope, $http, $location, $cookies, $rootScope, UserService) {
	$scope.loginForm = function () {

		$scope.hasSignedIn = $cookies.get('signedin');

		if ($scope.hasSignedIn != 'Y') {

			$http({
				method: "GET",
				url: "php/login.php",
				params: { uid: $scope.uid, pw: $scope.pw }
			}).then(function mySuccess(response) {
				$scope.myWelcome = response.data;
				if ($scope.myWelcome.response == 'success' && $scope.myWelcome.role == 'Administrator') {

					$cookies.put('userid', $scope.uid);
					$cookies.put('signedin', 'Y');

					$scope.userid = $scope.uid;

					$rootScope.loggedIn = true;
					
					$scope.errorMessage = false;

					UserService.signedin = 'Y';

					$location.path("/booking");
				} else {
					$scope.errorMessage = 'Login failed, wrong user ID or password!';
				}

			}, function myError(response) {
				$scope.myWelcome = response.status;
			});
		} else {
			$location.path("/");
		}
	}
});
