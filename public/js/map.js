
	mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 11 // starting zoom
    });
 
    
const el = document.createElement('div');

// Red circle background + white SVG
el.innerHTML = `
    <div style="
        background-color: red;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="28" height="28" fill="white">
            <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
        </svg>
    </div>
`;    

 const marker = new mapboxgl.Marker({color:'red',element:el})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})

        .setHTML(`<h4>${listing.location}</h4><p>Exacat location after booking</P>`))
        .addTo(map);


