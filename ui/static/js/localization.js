ymaps.ready(init);
function init(){
    let place=document.getElementById('center').innerText.split(/[\[\]]+/gm).filter(item => item !== " " && item!="").map(item => item.split(/\s/gm).map(item => parseFloat(item)).reverse());
    //.split(/[\[\]\s]+/g).filter(item => item !== "").map(item => parseFloat(item)).reverse();
    let location=document.getElementById('location').innerText.split(/[{\[\s\]}]/gm).filter(item => item!="")
    console.log(location)
    let long =0 
    let lat =0
    for (let index = 0; index < place.length; index++) {
        long+=place[index][0]
        lat+=place[index][1]
    }
    let center=[]

    center.push(long/place.length)
    center.push(lat/place.length)
    var myMap = new ymaps.Map("map", {
        center:center,     
        zoom: 2,
    });
    console.log(center)

    for (let index = 0; index < place.length; index++) {
        let city=location[index].toUpperCase().split('-')
        let placemark = new ymaps.Placemark(place[index],{
            iconContent: city[0].replace('_',' '),
            balloonContent:city[1],
        },{
            preset: "islands#redStretchyIcon",
        // iconLayout:'default#image',
        // iconImageHref: '',
        iconImageSize:[20,20],
        // iconImageOffset:[0,0]
        
    })
    myMap.geoObjects.add(placemark);
    }

}
