import Stopwatch from './stopwatch.js';

// TODO: 이 곳에 정답 코드를 작성해주세요.
const stopWatch = new Stopwatch();

let isRunning = false;
let intervalId;
let $maxLap;
let $minLap;

// 1. 시작, 중단 기능
const $timer = document.getElementById('timer');
const $startStopBtn = document.getElementById('start-stop-btn');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $startStopLabelBtn = document.getElementById('start-stop-btn-label');
const $lapResetLabelBtn = document.getElementById('lap-reset-btn-label');
const $laps = document.getElementById('laps');

const formatString = (time) => (time < 10 ? '0' + time : time);

const formatTime = (centiSecond) => {
    let result = '';
    // 예시) 8540 centisecond = 01:25.40
    let min = formatString(parseInt(centiSecond / 6000));
    let sec = formatString(parseInt((centiSecond - min * 6000) / 100));
    let centiSec = formatString(centiSecond % 100);
    result = `${min}:${sec}:${centiSec}`;
    return result;
};

const updateTime = (time) => {
    $timer.innerText = formatTime(time);
};

const onClickStartBtn = () => {
    if (isRunning === false) {
        stopWatch.start();
        intervalId = setInterval(() => {
            updateTime(stopWatch.centisecond);
        }, 10);
        $startStopLabelBtn.innerText = '중단';
        $lapResetLabelBtn.innerText = '랩';
    } else {
        stopWatch.pause();
        clearInterval(intervalId);
        $startStopLabelBtn.innerText = '시작';
        $lapResetLabelBtn.innerText = '리셋';
    }
    isRunning = !isRunning;
    $startStopBtn.classList.toggle('bg-red-600'); // remove
    $startStopBtn.classList.toggle('bg-green-600'); // add
};

$startStopBtn.addEventListener('click', onClickStartBtn);

// 3. 랩 기능

const handleCreateLap = () => {
    if (isRunning === true) {
        const [lapCnt, lapTime] = stopWatch.createLap();
        createLapList(lapCnt, lapTime);
    } else {
        // 스톱워치 초기화
        stopWatch.reset();
        updateTime(0);
        // 랩 초기화
        clearLapList();
    }
};

const createLapList = (lapCnt, lapTime) => {
    const $li = document.createElement('li');
    $li.setAttribute('data-time', lapTime);
    $li.className = 'flex justify-between py-2 px-3 border-b-2';
    const $span1 = document.createElement('span');
    $span1.innerText = '랩 ' + `${lapCnt}`;
    const $span2 = document.createElement('span');
    $span2.innerText = `${formatTime(lapTime)}`;
    $li.appendChild($span1);
    $li.appendChild($span2);

    // append laps
    $laps.prepend($li);
    // $laps.insertBefore($li, $laps.firstChild);

    // calculate Max & Min
    if ($minLap === undefined) {
        $minLap = $li;
        return;
    }
    if ($maxLap === undefined) {
        if (lapTime < $minLap.dataset.time) {
            $maxLap = $minLap;
            $minLap = $li;
            $minLap.classList.add('text-green-600');
            $maxLap.classList.add('text-red-600');
        }
        return;
    }
    if (lapTime < $minLap.dataset.time) {
        $minLap.classList.remove('text-green-600');
        $minLap = $li;
    } else if (lapTime > $maxLap.dataset.time) {
        $maxLap.classList.remove('text-red-600');
        $maxLap = $li;
    }
    $minLap.classList.add('text-green-600');
    $maxLap.classList.add('text-red-600');
};

$lapResetBtn.addEventListener('click', handleCreateLap);

// 4. 리셋 기능

const clearLapList = () => {
    $laps.innerHTML = '';
};

// 5. 키보드 조작 기능
// 키보드 L: 랩 L, 리셋 L 키보드 S: 시작 S, 중단 S

const handleKeyDown = (e) => {
    console.log(e);
    switch (e.code) {
        case 'KeyL':
            handleCreateLap();
            break;
        case 'KeyS':
            onClickStartBtn();
            break;
        default:
            break;
    }
};

document.addEventListener('keydown', (e) => handleKeyDown(e));

// 6. 최단, 최장 기록 강조 효과
// Lap 중 최장 Lap 기록은 붉은색으로 (text-red-600)
// 최단 Lap 기록은 초록색으로 (text-green-600) 표시
