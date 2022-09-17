const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "Anh-Se-Tot-Ma",
      singer: "Pham-Hong-Phuoc-Thuy-Chi",
      path: "./assets/music/Anh-Se-Tot-Ma-Pham-Hong-Phuoc-Thuy-Chi.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/1/4/14a37aebee55d8e58c368e11551f6c93_1469673610.jpg",
    },
    {
      name: "Khong-Cam-Xuc",
      singer: "Ho-Quang-Hieu",
      path: "./assets/music/Khong-Cam-Xuc-Ho-Quang-Hieu.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/0/0/0037fa44fb1ffa4a5ec148a4c14dccdf_1320641543.jpg",
    },
    {
      name: "Ngam-Hoa-Le-Roi",
      singer: "Chau-Khai-Phong",
      path: "./assets/music/Ngam-Hoa-Le-Roi-Remix-Chau-Khai-Phong.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/4/4/442e2538bdf74306dee0a47c2266fb61_1501212574.jpg",
    },
    {
      name: "Nguoi-Ay",
      singer: "Trinh-Thang-Binh",
      path: "./assets/music/Nguoi-Ay-Trinh-Thang-Binh.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/c/a/ca79cd05ebbc2de2536374d3a710df85_1356577120.jpg",
    },
    {
      name: "Tan-Cung-Noi-Nho",
      singer: "Will",
      path: "./assets/music/Tan-Cung-Noi-Nho-Will.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/cover/3/b/c/d/3bcd4a21a806a35f4b54f600b818faac.jpg",
    },
    {
      name: "Thu-Cuoi",
      singer: "Yanbi-Mr-T-Hang-BingBoong",
      path: "./assets/music/Thu-Cuoi-Yanbi-Mr-T-Hang-BingBoong.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_png/avatars/8/e/8e02a864575266866ce9ab90731747bc_1455449226.png",
    },
    {
      name: "Ton-Tho-Mot-Tinh-Yeu",
      singer: "Bang-Cuong-Khanh-Phuong",
      path: "./assets/music/Ton-Tho-Mot-Tinh-Yeu-Bang-Cuong-Khanh-Phuong.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/2/7/278044fad98a422bd9046a9670d2ae34_1298957122.jpg",
    },
    {
      name: "Tuy-Am",
      singer: "Xesi-Masew-Nhat-Nguyen",
      path: "./assets/music/Tuy-Am-Xesi-Masew-Nhat-Nguyen.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/f/9/f9c0475ec02716554fba3f63e5b4ac37_1504991428.jpg",
    },
    {
      name: "Vo-Tinh",
      singer: "Xesi-Hoaprox",
      path: "./assets/music/Vo-Tinh-Xesi-Hoaprox.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/cover/7/9/8/5/798559c5b7d028c351d34a37c7a598cc.jpg",
    },
    {
      name: "Yeu-5",
      singer: "Rhymastic",
      path: "./assets/music/Yeu-5-Rhymastic.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/covers/b/5/b5aa78aa102467e5648160a4ac93df8e_1486467660.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index = "${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
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

    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    // Xử lí khi CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      interation: Infinity,
    });

    cdThumbAnimate.pause();

    // Xử lí sự kiện thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      // Mờ dần
      cd.style.opacity = newCdWidth / cdWidth;

      // Xử lí khi click play
      playBtn.onclick = function () {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      };

      // Khi song được play

      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };
      // Khi song bị pause

      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      // Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;

          // duration: Trả về thời lượng của âm thanh / video hiện tại (tính bằng giây)
          // currentTime: Đặt hoặc trả về vị trí phát lại hiện tại trong âm thanh / video (tính bằng giây)
        }
      };

      // Xử lí khi tua song
      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };

      // Khi next song
      nextBtn.onclick = function () {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      // Khi prev song
      prevBtn.onclick = function () {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.prevSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      // Xử lí bật tắt random song
      randomBtn.onclick = function () {
        _this.isRandom = !_this.isRandom;
        _this.setConfig("isRandom", _this.isRandom);
        randomBtn.classList.toggle("active", _this.isRandom);
      };

      // Xử lí lặp lại một song
      repeatBtn.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);
      };
    };

    // Khi xử lí next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lí khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lí khi click vào song option
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / Xử lí các sự kiện DOM
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
