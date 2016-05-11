"use strict";

function MapCtrl($scope, $log, $compile, leafletData, helpersSrv){

	// Bootstrap the mofo
	configureLeaflet($scope, $log, $compile, leafletData, helpersSrv);

	// A button the user has to click to switch to 'add skatepark' modes
	$scope.isEditing 			= false;
	$scope.isMarkerInProg 		= false;


}
						
function toggleEditButton($scope, helpersSrv)
{
	if (!$scope.isEditing)
	{
		$scope.isEditing = true;
		helpersSrv.createToast("Click or tap on the map to add a new park!");
		helpersSrv.toggleEditOn();
	}
	else if ($scope.isEditing)
	{
		$scope.lastMarker.remove();
		$scope.isEditing = false;
		helpersSrv.toggleEditOff();
	}
}

function configureLeaflet($scope, $log, $compile, leafletData, helpersSrv)
{
	// where default images are stored
	L.Icon.Default.imagePath = '../../img/leaflet/';

	// Map center
	$scope.init = {
		lat: 51.505,
		lng: -0.09,
		zoom: 10
	}

	// Map 'tiles' (which is another name for a skin) + api keys
	$scope.tiles = {
		name: 'skate',
		url: 'https://api.mapbox.com/styles/v1/intheon/cinz0kw8i0006bgnmykeq58x6/tiles/{z}/{x}/{y}?access_token={apikey}',
		type: 'xyz',
		options: {
			apikey: 'pk.eyJ1IjoiaW50aGVvbiIsImEiOiJjaW5lZ3RkaDUwMDc2d2FseHhldHl0Y3dyIn0.L1RWCbggwqkNegUc1ZIwJw',
			mapid: 'mapbox://styles/intheon/cinz0kw8i0006bgnmykeq58x6'
		}
	}

	// store the map instance
	// returns a promise, which is ensures you dont run anything on 'undefined'
	leafletData.getMap("map-core").then((map) => {

		$scope.mapInstance = map;
		// Set a listener on the map instance

		$scope.mapInstance.on("click", (event) => {
			// Dont do anything if edit mode is off
			if (!$scope.isEditing)
			{
				return;
			}
			else
			{
				createTempMarker($scope, $compile, event.latlng);
			}
		})

		// Add the edit button
		L.easyButton( '<div class="waves-effect white lighten-4 btn-flat toggleControl">Add a park</div>', function(){
			toggleEditButton($scope, helpersSrv);
		}).addTo($scope.mapInstance);


	});

}

function popUpContent()
{
	return "<header-graphic></header-graphic>";
}

function createTempMarker($scope, $compile, position)
{
	if ($scope.lastMarker)
	{
		$scope.lastMarker.remove();
	}
		
	$scope.isMarkerInProg = true;
	$scope.lastMarker = L.marker([position.lat, position.lng]).addTo($scope.mapInstance);

	// This compiles the directive, because otherwise, you just get a blank pop up
	let directiveTag = $(document.createElement("add-new-skatepark"));
	let compiledDirective = $compile(directiveTag)($scope);

	$scope.lastMarker.bindPopup(compiledDirective[0]).openPopup()
}



export default MapCtrl;