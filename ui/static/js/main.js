let data = []
let min = document.querySelector("#min")
let max = document.querySelector("#max")
let creationDate = document.getElementById('creationDate').innerText.split(" ")
const rangeInput = document.querySelectorAll(".range-input input")
const yearInput = document.querySelectorAll(".year-input input")
const range = document.querySelector(".slider .progress")
let yearGap = 1
let showPlace = document.getElementById("showPlace")
const search = document.getElementById('search')
const matchList = document.getElementById('match-list')
min.value = (parseInt(creationDate[0]))
max.value = parseInt(creationDate[creationDate.length - 1])
const minYear = document.getElementById('minYear')
const maxYear = document.getElementById('maxYear')
minYear.min = min.value
maxYear.min = min.value
minYear.max = max.value
maxYear.max = max.value
minYear.value = min.value
maxYear.value = max.value
let FirstAlbum = document.getElementById('FirstAlbum').innerText.split(" ")
let startDateFromId = document.getElementById('startDateId')
let endDateFromId = document.getElementById('endDateId')
startDateFromId.value = FirstAlbum[0].split("-").map(item => item < 10 ? "0" + item : item).join("-")
endDateFromId.value = FirstAlbum[1].split("-").map(item => item < 10 ? "0" + item : item).join("-")
const startDateToFilter = startDateFromId.value.split("-").reverse().join("-")
const endDateToFilter = endDateFromId.value.split("-").reverse().join("-");
let dateStart, dateEnd;



function ApplyFilterButton() {
    document.getElementById('search').value = '';
    document.getElementById('match-list').innerText = '';
    let checkFilter = document.querySelectorAll('input[class="check"]:checked');
    let minYear = document.querySelector("#min").value
    let maxYear = document.querySelector("#max").value
    let groupName = [];
    startDateFromId = document.getElementById('startDateId')
    endDateFromId = document.getElementById('endDateId')
    dateStart = Date.parse(startDateFromId.value)
    dateEnd = Date.parse(endDateFromId.value)
    let country = document.getElementById("country").value.toLowerCase()
    let city = document.getElementById("city").value.toLowerCase()

    checkFilter.forEach(checkBox => {
        data.map(group => {

            if (checkBox.value == "1" && group.members.length === 1) {
                 groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
            if (checkBox.value == "2" && group.members.length === 2) {
                groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
            if (checkBox.value == "3" && group.members.length === 3) {
                 groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
            if (checkBox.value == "4" && group.members.length === 4) {
                 groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
            if (checkBox.value == "5" && group.members.length === 5) {
                 groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
            if (checkBox.value == "6" && group.members.length === 6) {
                 groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
            if (checkBox.value == "7" && group.members.length === 7) {
                 groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
            }
        })
    })

    if (checkFilter.length === 0) {
        data.map(group => {
             groupName = CheckCreationDate(minYear, maxYear, groupName, group, country, city)
        })
    }

    html = groupName.map(toHTML).join('')
    showPlace.innerHTML = html
}

function SelectCountry() {
    let CountryTest = JSON.parse(document.getElementById('LocationJson').innerText)
    let countrySel = document.getElementById("country");
    let citySel = document.getElementById("city");
    let cities = CountryTest[countrySel.value].sort()

    console.log(cities, "cities")
    htmlCityList = cities.map(city => `
        <option>${city}</option>
        `).join('')

    citySel.innerHTML = htmlCityList
}

function toHTML(user) {
    return `
    <div class="item-group">
        <a href="/group?id=${user.id}"><img src=${user.image} ></a> <br>
        <div class="text-div">
        <a class="text-group-name" href="/group?id=${user.id}">${user.name}</a>
        </div>
    </div>
    `
}


    


function ClearFilterButton() {
    loadAllGroupinMainPage()
}

function CheckCreationDate(minYear, maxYear, groupName, group, country, city) {
    const dateFirstAlbum = Date.parse(group.firstAlbum.split("-").reverse().join("-"))
    let isLocation = false
    if (country.length === 0 && city.length === 0 ) {
        isLocation = true
    }
      
    let len = group.locations.length
    for (let i = 0; i < len; i++) {
        if (group.locations[i][country] == city) {
            isLocation = true
        }
    }

    if ((group.creationDate >= minYear && group.creationDate <= maxYear) &&
        (dateFirstAlbum >= dateStart && dateFirstAlbum <= dateEnd) &&
        isLocation) {
        if (!groupName.includes(group)) {
            groupName.push(group)
            isLocation = false
        }
    }
    return groupName
}

function SearchClearButton() {
    document.getElementById('search').value = '';
    document.getElementById('match-list').innerText = '';
    loadAllGroupinMainPage()
    ClearFilterButton()
}

window.onclick = (event) => {
    if (!event.target.matches('.search')) {
        document.getElementById('match-list').innerText = ''
    }
}

yearInput.forEach(input => {
    input.addEventListener("input", e => {
        let minYear = parseInt(yearInput[0].value),
            maxYear = parseInt(yearInput[1].value);

        if ((maxYear - minYear >= yearGap) && maxYear <= rangeInput[1].max && (maxYear - minYear) <= (rangeInput[0].max - rangeInput[0].min)) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = minYear;
                range.style.left = 100 - ((rangeInput[0].max - minYear) * 100) / (rangeInput[0].max - rangeInput[0].min) + "%";
            } else {
                rangeInput[1].value = maxYear;
                range.style.right = (((rangeInput[1].max - maxYear) * 100) / (rangeInput[0].max - rangeInput[0].min)) + "%";
            }
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < yearGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - yearGap
            } else {
                rangeInput[1].value = minVal + yearGap;
            }
        } else {
            yearInput[0].value = minVal;
            yearInput[1].value = maxVal;
            range.style.left = 100 - ((rangeInput[0].max - minVal) * 100 / (rangeInput[0].max - rangeInput[0].min)) + "%";
            range.style.right = (((rangeInput[1].max - maxVal) * 100) / (rangeInput[0].max - rangeInput[0].min)) + "%";
        }
    });
});

function loadAllGroupinMainPage() {
    const allGroupFirstLoad = data.map(toHTML).join('')
    showPlace.innerHTML = allGroupFirstLoad

    let checkClass = document.querySelectorAll('.check')
    for (let i = 0; i < checkClass.length; i++) {
        checkClass[i].checked = false
    }
    min.value = parseInt(creationDate[0])
    max.value = parseInt(creationDate[creationDate.length - 1])
    range.style.left = 100 - ((rangeInput[0].max - min.value) * 100 / (rangeInput[0].max - rangeInput[0].min)) + "%";
    range.style.right = (((rangeInput[1].max - max.value) * 100) / (rangeInput[0].max - rangeInput[0].min)) + "%";
    rangeInput[0].value = min.value;
    rangeInput[1].value = max.value;
    startDateFromId.value = FirstAlbum[0].split("-").map(item => item < 10 ? "0" + item : item).join("-")
    endDateFromId.value = FirstAlbum[1].split("-").map(item => item < 10 ? "0" + item : item).join("-")
    search.value = ''
    document.getElementById("country").value=''
    document.getElementById("city").value=''
    document.getElementById("city").innerHTML=`<option value="" selected="selected" hidden disabled>Please select city</option>`

}

const searchMatches = searchText => {
    let groupList = []
    const regex = new RegExp(`^${searchText}`, 'gi')
    //тут создаем группы совпадений, остаются совпадающие группы (стракты) тип такого:{"id":19,"image":"https://groupietrackers.herokuapp.com/api/images/aerosmith.jpeg","name":"Aerosmith","members":["Steven Tyler","Tom Hamilton","Joey Kramer","Joe Perry","Brad Whitford"],"creationDate":1970,"firstAlbum":"05-09-1987","locations":["nevada-usa","london-uk","manchester-uk"],"concertDates":["*29-01-2020","31-01-2020","03-02-2020","05-02-2020","08-02-2020","10-02-2020","13-02-2020","15-02-2020","20-05-2020","23-05-2020","25-05-2020","28-05-2020","30-05-2020","02-06-2020","04-06-2020","*15-07-2020","*18-07-2020"],"relations":{"london-uk":["15-07-2020"],"manchester-uk":["18-07-2020"],"nevada-usa":["29-01-2020","31-01-2020","03-02-2020","05-02-2020","08-02-2020","10-02-2020","13-02-2020","15-02-2020","20-05-2020","23-05-2020","25-05-2020","28-05-2020","30-05-2020","02-06-2020","04-06-2020"]}}
    let groupName = data.filter(group => { //команда filter работает тип range и if, идет итерация по data, каждая единица group 
        if (group.name.match(regex) && !groupList.includes(group)) {
            groupList.push(group)
        }
        return group.name.match(regex) //если совпадает требованиям regexp он эту группу оставляет
    });


    let groupAlbum = data.filter(group => {
        return group.firstAlbum.match(regex)
    });

    let groupCreation = data.filter(group => {
        return group.creationDate.toString().match(regex)
    });

    let groupMember = data.filter(group => {
        return group.members.some(member => {
            if (member.match(regex) && !groupList.includes(group)) {
                groupList.push(group)
            }
            return member.match(regex)
        })
    });

    let groupLocation = data.filter(group => {
        return group.locations.some(location => {
            return Object.entries(location).some(country => {
                if ((country[0].match(regex) || country[1].match(regex)) && !groupList.includes(group)) {
                    groupList.push(group)
                }
                return country[0].match(regex) || country[1].match(regex)
            })
        })
    });

    if (searchText.length === 0) {         //если в поисковой строке ничего не введено обнуляет все группы
        groupName = [];
        groupMember = [];
        groupAlbum = [];
        groupLocation = [];
        groupCreation = [];
        matchList.innerHTML = ""
        loadAllGroupinMainPage()
        return
    }

    let htmlName = "";   //тут создаем html кусок, который отправляется в наш html и div-ку
    if (groupName.length > 0) {
        htmlName = groupName.map(match =>        //опять проходимся по группам, которые прошли отбор и совпадают, map проводит итерацию
            `<div class="card-match-list">
                <li><a href="/group?id=${match.id}">     
                ${match.name}-artist/band name
              </a></li>
              <div>`
        ).join('');             //match - -это каждая группа,и в каждой внутри можно обратиться к его элементам(id,name)
    }
    let htmlAlbum = "";
    if (groupAlbum.length > 0) {
        htmlAlbum = groupAlbum.map(match =>
            `<div class="card-match-list">
                <li><a href="/group?id=${match.id}">
                ${match.firstAlbum} - First album date | ${match.name}
              </a></li>
              <div>`
        ).join('');    //join объединяет html-ы всех итераций
    }
    let htmlCreation = "";
    if (groupCreation.length > 0) {
        htmlAlbum = groupCreation.map(match =>
            `<div class="card-match-list">
                <li><a href="/group?id=${match.id}">
                ${match.creationDate} - Group creation date | ${match.name}
              </a></li>
              <div>`
        ).join('');    //join объединяет html-ы всех итераций
    }
    let htmlMember = "";
    if (groupMember.length > 0) {  //тут почти то же, но еще проходим итерацию внутри мемберс и там внутри опять отфильтровываем
        let htmlMemberEach = "";    //создаем html для каждой группы и объединякт
        htmlMember = groupMember.map(group => {
            htmlMemberEach = group.members.filter(member => member.match(regex)).map(member => {
                return `<div class="card-match-list">
                    <li><a href="/group?id=${group.id}">
                   ${member} - member | ${group.name}
                   </a></li>
                  <div>`;
            }).join('');
            return htmlMemberEach;
        }).join('');
    }

    let htmlLocation = "";
    if (groupLocation.length > 0) {
        let htmlLocationEach = "";
        htmlLocation = groupLocation.map(group => {
            htmlLocationEach = group.locations.map(location => Object.entries(location).filter(country => country[0].match(regex) || country[1].match(regex)).map(country => {
                return `<div class="card-match-list">
                <li><a href="/group?id=${group.id}">
               ${Object.keys(location)}- ${Object.values(location)} - location | ${group.name}
               </a></li>
              <div>`;
            })).join('');
            return htmlLocationEach;
        }).join('');
    }

    let html = "";
    html = htmlName + htmlAlbum + htmlMember + htmlLocation + htmlCreation;
    matchList.innerHTML = html;

    let htmldateStart = groupList.map(toHTML).join('')
    showPlace.innerHTML = htmldateStart
};

const getMatches = async () => {
    data = JSON.parse(document.getElementById('json').innerText);
    loadAllGroupinMainPage()
};

window.addEventListener('DOMContentLoaded', getMatches)
search.addEventListener('input', () => searchMatches(search.value))