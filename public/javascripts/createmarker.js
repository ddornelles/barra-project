function initAutocomplete() {
  /* document.getElementById('button-search').onclick = function() {
    const input = document.getElementById('pac-input');

    google.maps.event.trigger(input, 'focus', {});
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
    google.maps.event.trigger(this, 'focus', {});
  }; */

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
                <input type="text" name="barraca-id" value="${item._id}" class="id-hidden" hidden>
                <div class="media">
                  <figure class="figure">
                    <img src="${item.imgPath}" class="figure-img img-fluid rounded align-self-start mr-3" alt="Barraca Picture">
                  </figure>
                  <div class="media-body">
                    <h5 class="mt-0"><a href="#" class="openModal" data-toggle="modal" data-target="#exempleModal1">${item.name}</a></h5>
                    <p>${item.description}</p>
                  </div>
                </div>
              </li>
              `;
            });
          }

          inject(closePlaces);
          console.log(closePlaces)
          const idHidden = document.querySelectorAll('.id-hidden');

          const modalContent = document.getElementById('modal-content');
          modalContent.innerHTML = '';

          document.querySelectorAll('.openModal').forEach((item, index) => {
            item.onclick = () => {
              let x = closePlaces.filter(item => item._id === idHidden[index].value);
              console.log(x)
              modalContent.innerHTML = `
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">${x[0].name}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <figure class="figure">
                    <img src="${x[0].imgPath}" class="figure-img img-fluid rounded" alt="Barraca Picture">
                  </figure>
                  <p><b>Descriçao:</b><br>${x[0].description}</p>
                  <p><b>Serviços:</b><br>
                    <i class="fas fa-umbrella-beach"></i> <i class="fas fa-utensils"></i> <i class="fas fa-beer"></i> <i class="fas fa-cocktail"></i></p>
                  <p class="alert alert-warning" role="alert">
                    <small>Alerta de <a href="#" class="alert-link">registro</a>/<a href="#"
                        class="alert-link">login</a></small>
                  </p>
                </div>
                <div class="modal-footer">
                  <a href="/reserva/${x[0]._id}" class="btn btn-info">Reservar</a>
                </div>
              </div>
              `
            };
          });

          console.log(idHidden[0].value);
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
