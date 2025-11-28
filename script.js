/* ===================================
   🌌 1. 全屏梦境粒子背景
=================================== */
const bg = document.getElementById("bgCanvas");
const ctx = bg.getContext("2d");

function resize() {
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
}
resize();
window.onresize = resize;

let particles = [];
for (let i = 0; i < 150; i++) {
    particles.push({
        x: Math.random()*bg.width,
        y: Math.random()*bg.height,
        r: Math.random()*2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random()*0.5 + 0.3
    });
}

function drawParticles() {
    ctx.clearRect(0,0,bg.width,bg.height);
    for (let p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(170,170,255,${p.alpha})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x<0||p.x>bg.width) p.vx*=-1;
        if (p.y<0||p.y>bg.height) p.vy*=-1;
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();


/* ===================================
   🌀 2. 记忆碎片左右切换 + 漂浮效果
=================================== */
const images = ["images/p1.jpg","images/p2.jpg","images/p3.jpg"];
let current = 0;

const centerImg = document.getElementById("memory-img");
const leftFrag = document.getElementById("side-left");
const rightFrag = document.getElementById("side-right");

function updateFragments() {
    centerImg.src = images[current];
    leftFrag.style.backgroundImage = `url(${images[(current - 1 + images.length)%images.length]})`;
    rightFrag.style.backgroundImage = `url(${images[(current + 1)%images.length]})`;
}
updateFragments();

/* 鼠标移动控制切换 */
document.addEventListener("mousemove", e => {
    let mid = window.innerWidth / 2;

    if (e.clientX < mid - 120) {
        leftFrag.style.transform = "translateY(-50%) scale(1.1)";
        rightFrag.style.transform = "translateY(-50%) scale(1)";
    } else if (e.clientX > mid + 120) {
        rightFrag.style.transform = "translateY(-50%) scale(1.1)";
        leftFrag.style.transform = "translateY(-50%) scale(1)";
    }
});

/* 左右点击切换 */
leftFrag.onclick = () => {
    current = (current - 1 + images.length) % images.length;
    updateFragments();
};

rightFrag.onclick = () => {
    current = (current + 1) % images.length;
    updateFragments();
};


/* ===================================
   🎤 3. 语音识别
=================================== */
let recognition = null;
const diaryText = document.getElementById("diaryText");

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";
}

document.getElementById("mic-button").onclick = () => {
    if (!recognition) {
        alert("你的浏览器不支持语音识别(建议 Chrome)");
        return;
    }

    diaryText.value = "🎤 正在倾听你的声音...\n";
    recognition.start();

    recognition.onresult = event => {
        let text = event.results[0][0].transcript;
        diaryText.value =
`🌙 温柔治愈日记（记忆碎片 ${current+1}）

你轻轻地说：“${text}”。

在梦境的记忆回廊中，这幅被光照亮的碎片开始微微发热。
你的声音像一条温柔的河流，
带着一点点疲惫，
一点点希冀，
还有只有你才拥有的那份柔软。

愿你把今天的风景都放进心里，
愿所有疲惫都在今晚慢慢溶解。

你值得被听见，
也值得被温柔以待。
`;
    };
};


/* ===================================
   📝 4. 日记复制 & 保存
=================================== */
document.getElementById("copyDiary").onclick = () => {
    diaryText.select();
    document.execCommand("copy");
    alert("已复制到剪贴板(*˘︶˘*)♡");
};

document.getElementById("saveDiary").onclick = () => {
    const blob = new Blob([diaryText.value], {type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `温柔日记-${current+1}.txt`;
    a.click();
};
