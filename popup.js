const ANIME_DATA = 'animeData';

document.addEventListener("DOMContentLoaded",function() {

  checkTitleOnLocaleStorage();

});

function parseUrl(url){
  const regex = /\/([^/]+)-ep-\d+$/;
  try{
    const [_, text] = url.match(regex);
    if (text) return text.replaceAll('-', ' ') 
  }catch(err){}
}

function populateElementFromUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const extractedAnimeTitle = tabs[0].url;
    const regex = /\/([^/]+)-ep-\d+$/;
    const result = extractedAnimeTitle.match(regex);

    if (result && result.length > 1) {
      const extractedText = result[1];
      const finalResult = extractedText.replaceAll("-", " ");
      eventoInput.value = finalResult;
    }
  });
}

const transformToKey = (key) => key.toUpperCase().replaceAll(' ', '_')

function saveInformationOnLocalStorage({ title, startTime, endTime }) {
  const oldData = getAnimeData() || {};
  const titleKey = transformToKey(title);
  const newAnime = { [titleKey]: { title, startTime, endTime } }
  setAnimeData(({...oldData, ...newAnime}))
}

function checkTitleOnLocaleStorage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = tabs[0].url;
    const titleKey = transformToKey(parseUrl(title) || '');
    const existData = getAnimeData()[titleKey];
    if(existData){
      document.getElementById("content").innerHTML = skipHtmlcode;
    } else {
      document.getElementById("content").innerHTML = htmlCode;

  const eventoInput = document.getElementById("eventoInput");
  const inizioInput = document.getElementById("inizioInput");
  const fineInput = document.getElementById("fineInput");
  const currentTimeBtn = document.getElementById("currentTimeBtn");
  const sendBtn = document.getElementById("sendBtn");
  const eventList = document.getElementById("eventList");

  const events = [];

  populateElementFromUrl();

  currentTimeBtn.addEventListener("click",function() {
    const now=new Date();
    const currentTime=`${String(now.getHours()).padStart(2,"0")}:${String(
      now.getMinutes()
    ).padStart(2,"0")}`;
    inizioInput.value=currentTime;
    fineInput.value=currentTime;
  });

  sendBtn.addEventListener("click",function() {
    const title=eventoInput.value;
    const startTime=inizioInput.value;
    const endTime=fineInput.value;
    const event={title,startTime,endTime};
    saveInformationOnLocalStorage(event);
    events.push(event);

    const radioBtn = document.createElement("input");
    radioBtn.type="radio";
    radioBtn.name="eventRadio";
    radioBtn.value=events.length-1;

    const eventText = document.createTextNode(title);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.addEventListener("click",function() {
      const index=parseInt(radioBtn.value);
      events.splice(index,1);
      radioBtn.remove();
      eventText.remove();
      deleteBtn.remove();
    });

    eventList.appendChild(radioBtn);
    eventList.appendChild(eventText);
    eventList.appendChild(deleteBtn);

    eventoInput.value="";
    inizioInput.value="";
    fineInput.value="";
  });

  listTaskAnimeDate();

    }
  })
}

function listTaskAnimeDate() {
  if(getArrayAnimeData()){
    const array = getArrayAnimeData();
    const events = []
    array.forEach(({title, startTime, endTime})=>{
      events.push({title, startTime, endTime});

      const radioBtn = document.createElement('input');
      radioBtn.type = 'radio';
      radioBtn.name = 'eventRadio';
      radioBtn.value = events.length - 1;

      radioBtn.addEventListener('click', () => {
        eventoInput.value = title;
        inizioInput.value = startTime;
        fineInput.value = endTime;
      })

      const eventText = document.createTextNode(title);
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent="Delete";
      deleteBtn.addEventListener("click",function() {
        const index=parseInt(radioBtn.value);
        events.splice(index,1);
        radioBtn.remove();
        eventText.remove();
        deleteBtn.remove();
      });
  
      eventList.appendChild(radioBtn);
      eventList.appendChild(eventText);
      eventList.appendChild(deleteBtn);
    })
  }
}

const getAnimeData = () => JSON.parse(localStorage.getItem(ANIME_DATA));
const setAnimeData = (data) => localStorage.setItem(ANIME_DATA, JSON.stringify(data));
const getArrayAnimeData = () => (getAnimeData()) ? Object.keys(getAnimeData()).map(key => (getAnimeData()[key])) : [];

const skipHtmlcode = `
<div class="container mt-3" style="width: 480px;">
<h1 class="mb-3">SKIP MODAL</h1>
</div>
`

const htmlCode = `
<div class="container mt-3" style="width: 480px;">
  <h1 class="mb-3">Aggiungi evento</h1>
  <div class="mb-3">
    <label for="eventoInput" class="form-label">Titolo dell'evento:</label>
    <input type="text" class="form-control" id="eventoInput" placeholder="Inserisci il titolo dell'evento">
  </div>
  <div class="row mb-3">
    <div class="col">
      <label for="inizioInput" class="form-label">Orario di inizio:</label>
      <div class="input-group">
        <input type="time" class="form-control" id="inizioInput">
        <button class="btn btn-outline-secondary" type="button" id="currentTimeBtn">Current Time</button>
      </div>
    </div>
    <div class="col">
      <label for="fineInput" class="form-label">Orario di fine:</label>
      <input type="time" class="form-control" id="fineInput">
    </div>
  </div>
  <button class="btn btn-primary mb-3" id="sendBtn">Send</button>

  <div id="eventList">
  </div>
</div>
`;