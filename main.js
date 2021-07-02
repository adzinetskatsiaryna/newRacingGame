const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
    btns = document.querySelectorAll('.btn');


    car.classList.add('car');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stoptRun);

const keys ={
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
}

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
    record: localStorage.getItem('best_record')
}

let startSpeed = 0;

const MAX_ENEMY = 7
const HEIGHT_ELEMENT = 100
const musik = new Audio('audio.mp3')
musik.volume=0.05

const getRandomEnemy =(max)=> Math.floor((Math.random() * max) + 1)
//const music = document.createElement('embed');
//musik.src = './audio.mp3'
//music.classList.add('visually-hidden')

function getQuantityElements (heightElement){
  return  document.documentElement.clientHeight/heightElement + 1 
  //(gameArea/offsetHeight / heightElement)+1 
 
}

const  changeLevel = (level)=>{
    switch(level){
        case '1':
            setting.traffic = 4;
            setting.speed = 3;
            break
        case '2':
            setting.traffic = 3;
            setting.speed = 5
            break
        case '3':
            setting.traffic = 3
            setting.speed = 7
            break
    }
    startSpeed = setting.speed;
}


function startGame (event){
    // document.body.append(music);
    // setTimeout(()=>{
    //     music.remove()
    // }, 3000)
    const target = event.target
    if(!target.classList.contains('btn')) return;

    const levelGame = target.dataset.levelGame;
    changeLevel(levelGame)
    btns.forEach(btn=>btn.disabled=true)
    musik.play()
    gameArea.style.minHeight = HEIGHT_ELEMENT + 'vh' //Math.floor((document.documentElement.clientHeight-HEIGHT_ELEMENT) /HEIGHT_ELEMENT )*HEIGHT_ELEMENT
    start.classList.add('hide');
    gameArea.innerHTML = '';
   

for(let i = 0; i < getQuantityElements(HEIGHT_ELEMENT); i++){
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i*HEIGHT_ELEMENT) + 'px';
    line.style.height = (HEIGHT_ELEMENT/2) + 'px'
    line.y = i*HEIGHT_ELEMENT
    gameArea.appendChild(line);
}

for (let i = 0; i< getQuantityElements(HEIGHT_ELEMENT*setting.traffic); i++){
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEMENT * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
        transparent 
        url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)
        center / cover
        no-repeat`;
    gameArea.appendChild(enemy)
 }

    setting.score = 0
    setting.start = true   
    gameArea.appendChild(car)
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.top = 'auto'
    car.style.bottom = '10px';
    setting.x = car.offsetLeft
    setting.y = car.offsetTop
    requestAnimationFrame(playGame)
}

function playGame (){
    if(setting.start){
        setting.score+=setting.speed;
        
       // score.innerHTML = 'SCORE<br>' + setting.score;
        
       score.innerHTML = `
       <p>SCORE: ${setting.score}</p>
       ${setting.record ? `<p> Best record: ${setting.record}</p>`: ''}`;
        
        setting.speed = startSpeed + Math.floor(setting.score / 2000)

        localStorage.setItem('score', setting.score)
        let localScore = localStorage.getItem('score')
        if(localStorage<setting.score){
            console.log('рекорд побит')
        }

        moveRoad();
        muveEnemy();

        if(keys.ArrowLeft && setting.x >0){
            setting.x -=setting.speed
        }
        if(keys.ArrowRight && setting.x <(gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed
        }
        
        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed
        }
        if(keys.ArrowDown  && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed
        }

        car.style.left = setting.x + 'px'
        car.style.top = setting.y + 'px'
        requestAnimationFrame(playGame)
    }
    
}

function startRun(event){
    //if(keys.hasOwnProherty(event.key)){
        event.preventDefault()
        keys[event.key] = true
    //}
}

function stoptRun(event){
   
    event.preventDefault()
    //if(keys.hasOwnProherty(event.key)){
    keys[event.key] = false
   //}
}

function moveRoad (){
    let lines = document.querySelectorAll('.line');

    lines.forEach(function(line, i){
        line.y +=setting.speed;
        line.style.top = line.y + 'px';
        if(line.y>= document.documentElement.clientHeight ){   //gameArea.offsetHeight
            line.y= -HEIGHT_ELEMENT
        }
    })
}

function muveEnemy (){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect()
        if(carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom>=enemyRect.top){
                setting.start = false;
                console.warn('ДТП');
                if(setting.score>setting.record){
                    localStorage.setItem('best_racord', setting.score);
                    alert(`Ура новый рекорд вы набрали на ${setting.score-setting.record} очков больше`);
                    setting.record=setting.score;
                    
                }
                start.classList.remove('hide');
                start.style.top = score.offsetHeight + 'px';

                //score.style.top = start.offsetHeight
                musik.pause()
                btns.forEach(btn=>btn.disabled=false)
        }
        item.y +=setting.speed / 2;
        item.style.top = item.y + 'px'
        if(item.y>=document.documentElement.clientHeight){    //gameArea.offsetHeight 
            item.y = -HEIGHT_ELEMENT * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
        }
    })  
}


