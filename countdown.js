// 一些常量
let WINDOW_WIDTH = 1024;
let WINDOW_HEIGHT = 500;
let RADIUS = 8;
let MARGIN_LEFT = 0;
let MARGIN_TOP = 30;

// 截止日期
const endTime = new Date().setHours(new Date().getHours() + 1);

// 当前展示时间
let curShowTimeSeconds = 0;

// 下落小球的相关设置
let balls = [];
const colors = ['#33b5e5', '#0099cc', '#aa66cc', '#9933cc', '#99cc00', '#669900', '#ffbb33', '#ff8800', '#ff44444', '#cc0000'];

window.onload = function() {
    console.log(document.body.clientWidth)
    console.log(document.body.clientHeight)
    // 屏幕自适应
    WINDOW_WIDTH = document.documentElement.clientWidth;
    WINDOW_HEIGHT = document.documentElement.clientHeight - 10;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    console.log(RADIUS)
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);

    // 获取上下文
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    
    // 定义长宽
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    // 现在渲染的时间
    curShowTimeSeconds = getCurrentShowTimeSeconds();

    // 渲染
    // render(context);

    // 渲染加定时器
    setInterval(function() {
        render(context);
        update();
    }, 20)
}

function getCurrentShowTimeSeconds() {
    // 获取差的秒数
    let curTime = new Date();
    // let ret = endTime.getTime() - curTime.getTime();
    let ret = endTime - curTime.getTime();
    ret = Math.round(ret / 1000);

    return ret >= 0 ? ret : 0;
}

function update() {
    let nextShowTimeSeconds = getCurrentShowTimeSeconds();
    // 下一次的小时、分钟、秒钟
    let nextHours = parseInt(nextShowTimeSeconds / 3600);
    let nextMinutes = parseInt(nextShowTimeSeconds - nextHours * 3600)/ 60;
    let nextSeconds = nextShowTimeSeconds % 60;

    let curHours = parseInt(curShowTimeSeconds / 3600);
    let curMinutes = parseInt(curShowTimeSeconds - curHours * 3600)/ 60;
    let curSeconds = curShowTimeSeconds % 60;

    if(nextSeconds !== curSeconds) {
        // 添加小球下落效果
        if(parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
        }
        if(parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(nextHours % 10));
        }
        if(parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(nextMinutes / 10));
        }
        if(parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(nextMinutes % 10));
        }
        if(parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds / 10));
        }
        if(parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}

function updateBalls() {
    for(let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        // 地板的碰撞检测
        if(balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }

    // 对balls数组中的项进行优化，降低length
    let cnt = 0;
    for(let i = 0; i < balls.length; i++) {
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            balls[cnt++] = balls[i];
        }
    }
    // 去除balls[cnt]后面的项
    while(balls.length > cnt) {
        balls.pop();
    }
}

function render(cxt) {
    // 每次要对canvas区域进行刷新操作
    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    // 小时、分钟、秒钟
    let hours = parseInt(curShowTimeSeconds / 3600);
    let minutes = parseInt(curShowTimeSeconds - hours * 3600)/ 60;
    let seconds = curShowTimeSeconds % 60;

    // 渲染二维点阵
    // 小时
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
    // 冒号
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    // 分钟
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
    // 冒号
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    // 秒
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);

    // 绘制小球
    for(let i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0 , 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();
    }
}

function addBalls(x, y, num) {
    for(let i = 0; i < digit[num].length; i++) {
        for(let j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] === 1) {
                let aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.random() >= 0.5 ? 4 : -4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                }
                balls.push(aBall);
            }
        }
    }
}

function renderDigit(x, y, num, cxt) {

    cxt.fillStyle = 'rgb(0, 102, 153)';

    for(let i = 0; i < digit[num].length; i++) {
        for(let j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] === 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI, true);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}