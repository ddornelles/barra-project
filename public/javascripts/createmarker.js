function initAutocomplete() {
  document.getElementById('button-search').onclick = function() {
    const input = document.getElementById('pac-input');

    google.maps.event.trigger(input, 'focus', {});
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
    google.maps.event.trigger(this, 'focus', {});
  };

  const map = new google.maps.Map(document.getElementById('searchmap'), {
    center: { lat: -22.9644821, lng: -43.2308992 },
    zoom: 13,
    mapTypeId: 'roadmap',
  });

  // Create the search box and link it to the UI element.
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      let closePlaces = [];
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }

      axios
        .get('/api')
        .then((response) => {
          const calculateDist = (
            markerCoordinates,
            targetLatitude,
            targetLongitude,
          ) => {
            const marker = new google.maps.LatLng(
              targetLatitude,
              targetLongitude,
            );
            return google.maps.geometry.spherical.computeDistanceBetween(
              markerCoordinates,
              marker,
            );
          };

          const compare = (barraca) => {
            barraca.forEach((item) => {
              if (
                calculateDist(
                  place.geometry.location,
                  item.location.coordinates[1],
                  item.location.coordinates[0],
                ) < 3000
              ) {
                item.distance = calculateDist(
                  place.geometry.location,
                  item.location.coordinates[1],
                  item.location.coordinates[0],
                ).toFixed(2);
                closePlaces.push(item);
              }
            });
          };
          compare(response.data.barracas);

          const barracaList = document.querySelector('#list-barracas');
          barracaList.innerHTML = '';
          function inject(arr) {
            arr.forEach((item) => {
              barracaList.innerHTML += `
              <li class="list-group-item d-flex">
                <div class="media">
                  <figure class="figure">
                    <img src="${item.imgPath}" class="figure-img img-fluid rounded align-self-start mr-3" alt="Barraca Picture">
                  </figure>
                  <div class="media-body">
                    <h5 class="mt-0"><a href="#" data-toggle="modal" data-target="#exampleModal">${item.name}</a></h5>
                    <p>${item.description}</p>
                  </div>
                </div>
              </li>
              `;
            });
          }
          
          inject(closePlaces);
        })
        .catch((error) => {
          console.log(error);
        });

      document.getElementById('search-result').innerHTML =
        place.formatted_address;

      // will inject nearby shops to the query search

      // don't know what does
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      console.log(closePlaces);
    });
    map.fitBounds(bounds);
  });

  const getBarracas = () => {
    axios
      .get('/api')
      .then((response) => {
        placeBarracas(response.data.barracas);
      })
      .catch((error) => {
        console.log(error);
      });
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
  };

  getBarracas();
}
