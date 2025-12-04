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
   🌀 2. 记忆碎片左右切换
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

leftFrag.onclick = () => { current = (current - 1 + images.length) % images.length; updateFragments(); };
rightFrag.onclick = () => { current = (current + 1) % images.length; updateFragments(); };


/* ===================================
   🎤 3. 语音识别 + 自动回复
=================================== */

const micBtn = document.getElementById("mic-button");
const diaryText = document.getElementById("diaryText");

let isRecording = false;
let recognition = null;

// 夸夸语句池（你给的全部都放进来了）
const replies = [
"张艾嘉，生日快乐，愿你永远闪闪发光！",
"张艾嘉的世界，因画笔而五彩斑斓。",
"祝张艾嘉心想事成，万事如意。",
"张艾嘉，你本身就是一件美好的艺术品。",
"愿所有的美好，都与张艾嘉环环相扣。",
"张艾嘉，生日快乐，日日是好日。",
"祝张艾嘉的每一天都充满阳光和灵感。",
"张艾嘉，愿你快乐，不止生日。",
"为你欢呼！",
"张艾嘉，万事尽可期待。",
"张艾嘉，你的画笔下有整个宇宙。",

"张艾嘉！速速更新画作！",
"本网站唯一VIP：张艾嘉。",
"警报！发现天才画家：张艾嘉！",
"张艾嘉粉丝后援会官方站点。",
"点击此处，收获张艾嘉的好运祝福。",
"嘘…你听，有人在说张艾嘉真厉害。",
"张艾嘉的画笔，是魔法棒吗？",
"今天，你为张艾嘉点赞了吗？",
"系统提示：您的好友‘大画家张艾嘉’已上线。",

"独立又可爱的灵魂，张艾嘉。",
"祝张艾嘉永远是自己人生画卷的主角。",

"你笔下的星光，落成了张艾嘉的名字。",
"张艾嘉的画里，有风的声音，光的温度。",
"你把时间变成了画，我把画变成了祝福。",

"警告：本页面因张艾嘉的才华而过度闪耀，请佩戴墨镜浏览。",
"系统检测到高能天才：张艾嘉。请保持距离，避免被美晕。",
"张艾嘉，你的画好看到违反了《美丽法》第233条。",
"请输入‘我是天才’以证明你是张艾嘉本人。",
"本网站已被张艾嘉的画全面接管，投降吧！",

"紧急通知：张艾嘉的画作库存即将告急，请速来补充！",

"访问者，请交出你对张艾嘉的赞美，方可通行。",
"张艾嘉！你的画笔是不是从霍格沃茨买的？",
"本网站运行在张艾嘉夸夸引擎上。",

"检测到用户正在搜索‘世界上最棒的画家’……结果：张艾嘉。",
"张艾嘉粉丝打卡处：滴，今日夸夸卡。",
"您的好友‘宇宙第一小画家张艾嘉’发来一条颜文字：(๑•̀ㅂ•́)و✧",
"这不是普通的网页，这是通往‘张艾嘉夸夸星球’的传送门。",

"本网站的唯一错误代码：张艾嘉画得太好导致系统无法承载。",
"嘘…我正在偷偷下载张艾嘉的才华。",
"张艾嘉，联合国教科文组织‘可爱又厉害’遗产名录在找你。",
"温馨提示：长时间欣赏张艾嘉的画作可能导致幸福感爆棚，属正常现象。",
"张艾嘉，你画画的背影，像极了世纪巨匠（开玩笑的，你就是）。",
"AI绘画最大危机：无法复制名为‘张艾嘉’的灵魂。",
"张艾嘉，坦白吧，你是不是给颜料施了魔法？",
"本网站已为张艾嘉开启永久VIP彩虹屁通道。",

"系统提示：发现‘野生大触’张艾嘉一只，请务必投喂夸奖以维持其活力。"
];

// 初始化语音识别
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;

    recognition.onresult = e => {
        const text = e.results[0][0].transcript;
        diaryText.value = `你说：${text}`;
    };

    recognition.onend = () => {
        if (isRecording) return;

        // 停止后随机回击一句“夸夸语”
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        diaryText.value += `\n\n系统自动回复：${randomReply}`;
    };
}

micBtn.onclick = () => {
    if (!recognition) {
        alert("你的浏览器不支持语音识别，推荐 Chrome！");
        return;
    }

    if (!isRecording) {
        isRecording = true;
        micBtn.style.background = "rgba(255,120,120,0.4)";
        micBtn.textContent = "🎙️";
        diaryText.value = "正在听你说话…";
        recognition.start();
    } else {
        isRecording = false;
        micBtn.style.background = "rgba(255,255,255,0.23)";
        micBtn.textContent = "🎤";
        recognition.stop();
    }
};
/* ===================================
   🔒 5. 密码开锁系统
=================================== */
const lockScreen = document.getElementById("lock-screen");
const secretInput = document.getElementById("secret-input");
const secretBtn = document.getElementById("secret-btn");
const secretHint = document.getElementById("secret-hint");

secretBtn.onclick = () => {
    const text = secretInput.value.trim();

    if (text === "李若怡真厉害") {
        // ✔ 正确 → 淡出黑屏
        lockScreen.style.transition = "opacity 1.2s";
        lockScreen.style.opacity = "0";

        setTimeout(() => {
            lockScreen.style.display = "none";
        }, 1200);

    } else {
        // ❌ 错误 → 提示
        secretHint.textContent = "指令错误，详情请咨询李若怡";
    }
};
