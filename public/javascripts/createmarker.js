function initAutocomplete() {

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
                ) < 2000
              ) {
                item.distance = calculateDist(
                  place.geometry.location,
                  item.location.coordinates[1],
                  item.location.coordinates[0],
                ).toFixed(0);

                closePlaces.push(item);
              }
            });
          };
          compare(response.data.barracas);

          const barracaList = document.querySelector('#list-barracas');
          barracaList.innerHTML = '';

          const node = document.createElement('p');
          const textnode = document.createTextNode('Barracas encontradas:');
          node.appendChild(textnode);
          document.getElementById('list-barracas').appendChild(node);

          function inject(arr) {
            arr.forEach((item) => {
              barracaList.innerHTML += `
              <li class="list-group-item d-flex">
                <input type="text" name="barraca-id" value="${item._id}" class="id-hidden" hidden>
                <div class="media">
                  <figure class="figure beaches mr-2">
                    <img src="${item.imgPath}" class="figure-img img-fluid rounded align-self-start mr-3" alt="Barraca Picture">
                  </figure>
                  <div class="media-body ml-2">
                    <h6 class="mt-0"><a href="#" class="openModal" data-toggle="modal" data-target="#barracaModal">${item.name}</a></h6>
                    <p>Está a ${item.distance} metros da sua busca.</p>
                  </div>
                </div>
              </li>
              `;
            });
          }

          inject(closePlaces);
          /* console.log(closePlaces) */
          const idHidden = document.querySelectorAll('.id-hidden');

          const modalContent = document.getElementById('modal-content');
          modalContent.innerHTML = '';

          document.querySelectorAll('.openModal').forEach((item, index) => {
            item.onclick = () => {
              let x = closePlaces.filter(item => item._id === idHidden[index].value);
              console.log(x)
              modalContent.innerHTML = `
                <div class="modal-header">
                  <h6 class="modal-title" id="exampleModalLabel">${x[0].name}</h6>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <figure class="figure">
                    <img src="${x[0].imgPath}" class="figure-img img-fluid rounded" alt="Barraca Picture">
                  </figure>
                  <p><b>Descriçao:</b><br><small>${x[0].description}</small></p>
                  <p><b>Serviços:</b><br>
                    <span class="d-flex justify-content-around mt-1">
                      <i class="fas fa-umbrella-beach"></i>
                      <i class="fas fa-chair"></i>
                      <i class="fas fa-utensils"></i>
                      <i class="fas fa-beer"></i>
                      <i class="fas fa-cocktail"></i>
                    </span>
                  </p>
                </span>
                <div class="modal-footer d-flex flex-column">
                <p class="alert alert-warning" role="alert">
                    <small>Será pedido login ou registro para realizar a reserva.</small>
                  </p>
                  <p><a href="/reserva/${x[0]._id}" class="btn btn-info">Reservar</a></p>
                </div>
              `
            };
          });

        })
        .catch((error) => {
          console.log(error);
        });

      document.getElementById('search-result').innerHTML = place.formatted_address;

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

window.onload = () => {
  initAutocomplete();
};