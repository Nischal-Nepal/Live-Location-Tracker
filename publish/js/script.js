
//connection request back-end ma janxa
const socket = io();

if(navigator.geolocation){

    //position track garxa yeslay chai
    navigator.geolocation.watchPosition( (position) => {

      //yeslai latidue, longitude nikalxa
     const {latitude, longitude} = position.coords;

     socket.emit("send-loaction", {latitude, longitude});
    }, (error) => {
        console.log(error);
    },
   {
    enableHighAccuracy: true,
    timeout: 5000, //yeslay chai 5second paxi fari check garxa ka xa location
    maximumAge: 0,
   }
  );
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Sheryians Coding School"
}).addTo(map)


const markers = {};

socket.on("receive-location", (data) => {
    const{id, latitude, longitude} = data;
    map.setView([latitude, longitude],);

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

//yeslay chai user disconnect vyo paxi user ko Arrow dhaukaudina
socket.on("user-disconnected", (id) => {
     if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
     }
});