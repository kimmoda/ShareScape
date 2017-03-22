//Angular JS
angular.module("myApp", [])
	.controller("MainController", ["$scope", "$http", function($scope, $http) {
		$scope.message = "Hello World!";
		
		/*
		When deploying to heroku, change 
		'http://localhost:3000/api/posts'
		to
		'https://sharescape.herokuapp.com/api/posts'
		*/
		
		$http.get('https://sharescape.herokuapp.com/api/posts')
			.success(function (posts) {
				$scope.posts = posts
			});
		
		/*//Old version, tries to place map markers before map is loaded (sometimes?)
		$http.get('http://localhost:3000/api/posts')
			.success(function (posts) {
				$scope.posts = posts
			});
		
		/*
		
		/*/
		$http.get('http://localhost:3000/api/posts')
			.success(function (posts) {
				for(var i=0; i<posts.length; i++){
					$scope.makeMarker(posts[i].pos.lat, posts[i].pos.lon)
				}	
				$scope.posts = posts
			});
		

		//Creates a post
		$scope.createPost = function() {
			console.log(userPos);
			if ($scope.title) {
				$http.post('/api/posts', {
					title: $scope.title,
					pos: {
						lat: $scope.userPos.lat,
						lon: $scope.userPos.lon
					},
					rating: 0,
					imglink: $scope.imglink,
				})
				.success(function (post) {
					$scope.posts.unshift(post)
					$scope.title = null
					//Clears title and imglink fields
					$scope.title = "";
					$scope.imglink = "";
				})	
			}

		};
		
		//Places a marker at the specified lat and lon
		$scope.makeMarker = function(x, y) {
			//console.log(x, y)
			//console.log($scope.map)
			//console.log($scope.posts)
			var marker = new google.maps.Marker({
				position: {lat: x, lng: y},
				map: $scope.map
   			})
		};
		
		//Places markers for all posts in $scope.posts
		$scope.makeMarkers = function() {
			for(var i = 0; i < $scope.posts.length; i++){
				$scope.makeMarker($scope.posts[i].pos.lat, $scope.posts[i].pos.lon)
				console.log(
					"Post marked: " +
					$scope.posts[i].pos.lat.toFixed(7) + ", " + 
					$scope.posts[i].pos.lon.toFixed(7) + ", " + 
					$scope.posts[i].title
				)
			}
		}

		//Increments post rating (non-functional atm because of scope issues due to calling it from a directive)
		$scope.upvote = function(index) {
			console.log("u tryna upboat fam xDD");
			$scope.posts[index].rating += 1;
		};
		
		//Decrements post rating (non-functional atm because of scope issues due to calling it from a directive)
		$scope.downvote = function(index) {
			console.log("downboats lololo");
			console.log($scope.posts[index]);
			$scope.posts[index].rating -= 1;
		};

		$scope.openNav = function(link) {
			document.getElementById("bigImage").src = link;
   			document.getElementById("myNav").style.width = "100%";
		}
		
		//Position of the user, set by "js/scripts/script.js" when the user shares position
		$scope.userPos;
		
		//Map, set by "js/scripts/script.js" when the user shares position
		$scope.map;
	}])
	
	//Post template
	.directive("postInfo", function() {
		return {
			restrict: "E",
			scope: {
				info: "="
			},
			templateUrl: "js/directives/postInfo.html"
		};
	})
	
	//Adds a "+" in front of a number if it is positive
	.filter('rating', function() {
		return function(x) {
			if(x > 0) {
				return "+" + x;
			} else {
				return x;
			}
		};
	})