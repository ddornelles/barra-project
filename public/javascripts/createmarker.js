function searchMap() {
  // Initialize the map
  const map = new google.maps.Map(document.getElementById('searchmap'), {
    zoom: 15,
    center: new google.maps.LatLng(-22.9732303, -43.2033079),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  const getBarracas = () => {
    axios.get('/api')
      .then((response) => {
        placeBarracas(response.data.barracas);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const placeBarracas = (barracas) => {
    barracas.forEach((barraca) => {
      const center = {
        lat: barraca.location.coordinates[1],
        lng: barraca.location.coordinates[0],
      };
      const pin = new google.maps.Marker({
        position: center,
        map,
        title: barraca.name,
      });
    });
  }
  
  getBarracas();

  const request = {
    query: req.params,
    fields: ['name', 'geometry'],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i += 1) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });


}

searchMap();
