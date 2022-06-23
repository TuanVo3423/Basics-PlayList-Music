const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'MY_PLAYER'
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const playOrPauseBtn = $('.player')
const processBar = $('#progress')
const nextBtn = $('.btn-next')
const previousBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex : 0,
    isPlay : false,
    isRandom : false,
    isRepeat : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig : function(key,value){
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    } ,
    songs:[
            {
              name: "double take",
              singer: "dhruv",
              path: "./asset/Music-SONG/dhruv.mp3",
              image: "https://i1.sndcdn.com/artworks-sYokoMVyU1CFgKC6-ZxMZtQ-t500x500.jpg"
            },
            {
                name: "AngelBaby",
                singer: "Troye Sivan",
                path: "./asset/Music-SONG/AngelBaby.mp3",
                image: "https://i1.sndcdn.com/artworks-c65kxyzzl7RsbzFi-jij4Ew-t500x500.jpg"
              },
              {
                name: "SeeYouAgain",
                singer: "Charlie Puth",
                path: "./asset/Music-SONG/SeeYouAgain.mp3",
                image: "https://i0.wp.com/mybestfeelings.com/wp-content/uploads/2022/01/rsz_1the_queen_of_twerking191-scaled.jpg"
              },
              {
                name: "Everything I Need",
                singer: "Skylar Grey",
                path: "./asset/Music-SONG/Skylar Grey.mp3",
                image: "https://i.ytimg.com/vi/9thM5gLs2tg/maxresdefault.jpg"
              },
            {
                name: "Talking To The Moon",
                singer: "Bruno Mars",
                path: "./asset/Music-SONG/TalkingToTheMoon.mp3",
                image: "https://i.ytimg.com/vi/dwArXwkAsNE/maxresdefault.jpg"
            },
            {
                name: "Reality",
                singer: "Lost Frequencies",
                path: "./asset/Music-SONG/Reality.mp3",
                image: "https://i.ytimg.com/vi/8EHf7T04J3A/maxresdefault.jpg"
            },
            {
                name: "Shape Of You",
                singer: "Ed Sheeran",
                path: "./asset/Music-SONG/ShapeOfYou.mp3",
                image: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg"
              },
              {
                  name: "Just Give Me a Reason",
                  singer: "Pink, Nate Ruess",
                  path: "./asset/Music-SONG/JustGiveMeaReason.mp3",
                  image: "https://i.ytimg.com/vi/D1CpWYU3DvA/maxresdefault.jpg"
                },
                {
                  name: "Proud Of You",
                  singer: "Fiona Fung",
                  path: "./asset/Music-SONG/ProudOfYou.mp3",
                  image: "https://avatar-ex-swe.nixcdn.com/song/2019/08/28/7/4/3/a/1566959799276_640.jpg"
                }
    ],
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get : function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handlerEvents: function(){
        const _this = this;
          // CD go around
        const cdAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }],{
            duration : 10000,
            iterations : Infinity
        });
        cdAnimate.pause();
        
        
        const cdWidth = cd.offsetWidth;
        // scroll
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            console.log(newWidth)
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = (newWidth/cdWidth);
          };
          // play audio click
            playBtn.onclick = function(){  
                audio.onplay = function(){
                    console.log('onplay')
                    _this.isPlay = true;
                    playOrPauseBtn.classList.add('playing')
                    cdAnimate.play();
                }
                audio.onpause = function(){
                    console.log('pause')
                    _this.isPlay = false;
                    playOrPauseBtn.classList.remove('playing')
                    cdAnimate.pause();
                }  
            if(_this.isPlay){
                audio.pause();
            }       
            else{
                audio.play();
            }
               
          }
          // play by percent of video
          audio.ontimeupdate = function(){
              if(audio.duration){
                  const processPercent = Math.floor(audio.currentTime/audio.duration * 100);
                  processBar.value = processPercent;
              }
              else{
                  processBar.value = 0;
              }
          }

          // play change the processBar
          processBar.oninput = function(e){
              const valueOfChangeProcess = e.target.value / 100 * audio.duration;
              audio.currentTime = valueOfChangeProcess;              
          }

          // go to next song
          nextBtn.onclick = function(){
              if(_this.isRandom){
                _this.goToRandomSong();

              }
              else{
                  _this.goToNextSong();  
              }
              audio.play();
              console.log(_this.isPlay)// false
              _this.render();
              _this.scrollIntoView();
          }
          // go to previous song
          previousBtn.onclick = function(){
              if(_this.isRandom){
                _this.goToRandomSong();
              }
              else{
            _this.goToPreviousSong();
              }
              audio.play();
              _this.render();
              _this.scrollIntoView();
          }

          // random btn
          randomBtn.onclick = function(){
              _this.isRandom = !_this.isRandom;
              _this.setConfig('isRandom',_this.isRandom)
              randomBtn.classList.toggle('active',_this.isRandom)
              
          }

          // next song when audio ended
          audio.onended = function(){
              if(_this.isRepeat){
                audio.play();
              }
              else{
                nextBtn.click();
              }
          }
          // repeat song
          repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
              _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
          }
          // get Action click playlist
          // close => boolean 
          
          playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
              if(songNode){
                const songNodeIndex = Number(songNode.getAttribute('data-index'))
                _this.currentIndex = songNodeIndex;
                _this.loadCurrentSong();
                _this.render();
                audio.play();
              }
            }
          }
    },
    scrollIntoView : function(){
      var currentIndex = this.currentIndex;
      setTimeout(() => {
        $('.song.active').scrollIntoView({
          behavior : 'smooth',
          block : 'end',
          inline : 'nearest'
        });
      }, 100);
      
    },
    render : function(){
        var htmls = this.songs.map(function(song , index){
            return `<div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          `;
        });
        const playList = $('.playlist').innerHTML = htmls.join("");
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    goToNextSong : function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;   
        }
        this.loadCurrentSong();
    },
    loadConfig : function(){
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;
    },
    goToPreviousSong : function(){
      this.currentIndex--;
      if(this.currentIndex<0){
          this.currentIndex = this.songs.length-1;
      }
      this.loadCurrentSong();
  },
  goToRandomSong : function(){
      let randomIndex;
      do{
          randomIndex = Math.floor(Math.random()* this.songs.length);
      }while(randomIndex==this.currentIndex);
      this.currentIndex = randomIndex;
      this.loadCurrentSong(); 
  },
    start: function(){
        this.loadConfig();
        this.defineProperties();
        this.handlerEvents();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);

    },
    
}
app.start();
