const inputText = document.getElementById('inputText');
const inputBtn = document.querySelector('#insert');
const delAllBtn = document.querySelector('#delAll');
const ul = document.querySelector('.todos');
const modal = document.querySelector('.modal');
const todoKey = 'todoKey';
let todoArr = [];

// 리스트 갯수 카운팅 함수
function countTodo() {
    const toDoIt = document.querySelector('.toDoIt');
    const toDoFin = document.querySelector('.toDoFin');
    const toDoAll = document.querySelector('.toDoAll');
    const lis = ul.querySelectorAll('li');
    const done = ul.querySelectorAll("input[type='checkbox']:checked");
    console.log(done)
    toDoIt.innerText = lis.length;
    toDoAll.innerText = lis.length;
    toDoFin.innerText = done.length;
}

// 로컬에 키 값 지정 후, 배열 형태로 저장
function saveTodo() {
    localStorage.setItem(todoKey, JSON.stringify(todoArr));
}

// 태그 생성, bool 값 초기 상태 설정
function makeTodo(text, bool = false) {
    const li = document.createElement('li');
    const delBtn = document.createElement('button');
    const span = document.createElement('span');
    const finBtn = document.createElement('input');
    const finLabel = document.createElement('label');
    const modiBtn = document.createElement('button');
    finBtn.type = 'checkbox';
    const id = todoArr.length + 1;
    delBtn.addEventListener('click', delTodo);
    finBtn.addEventListener('change', checkTodo);
    modiBtn.addEventListener('click', openModal);
    span.textContent = text;
    li.appendChild(finBtn);
    li.appendChild(finLabel);
    li.appendChild(span);
    li.appendChild(modiBtn);
    li.appendChild(delBtn);
    ul.appendChild(li);
    li.id = id;
    finBtn.id = 'fin'+id;
    finLabel.htmlFor = 'fin'+id;

    // 체크박스 상태 설정
    finBtn.checked = bool;

    // 배열에 입력 내용 추가
    const todoObj = { id: id, text, bool };
    todoArr.push(todoObj);
    saveTodo();
    countTodo();
}

// 버튼 클릭 시 동작 함수
function startTodo() {
    const val = inputText.value;
    makeTodo(val); // 만들어질 태그에 li 밸류값 전달
    inputText.value = ''; // 초기화
}

// 로컬에서 불러오기
function loadTodo() {
    const loadTodos = localStorage.getItem(todoKey);

    if (loadTodos !== null) {
        // 로컬서 값 가져오기
        const jsonTodo = JSON.parse(loadTodos);
        // todoArr에 담겨있는 각 text 내용을 전달
        jsonTodo.forEach((todo) => {
            makeTodo(todo.text, todo.bool);
        });
    }
}

// 삭제 함수
function delTodo(ev) {
    const del = ev.target;
    const momLi = del.parentNode;
    ul.removeChild(momLi);

    // true를 반환하는 요소만 새로 배열로 반환
    const delTodo = todoArr.filter((todo) => {
        return todo.id !== parseInt(momLi.id);
    });
    todoArr = delTodo;
    saveTodo();
    countTodo();
}

// 전체 삭제 함수
function delAll() {
    localStorage.clear();
    location.reload();
    countTodo();
}

// 할 일 확인 함수 
function checkTodo(ev) {
    const tar = ev.target;
    const mom = tar.parentNode;
    const todoId = parseInt(mom.id);
    const todoItem = todoArr.find(todo => todo.id === todoId);
    
    if (tar.checked) {
        mom.classList.add('check');
        todoItem.bool = true;
    } else {
        mom.classList.remove('check');
        todoItem.bool = false;
    }
    saveTodo();

    countTodo();
}

// 모달창 함수
function openModal() {
    modal.classList.add('on');
    makeModal(this);
}

// 모달창 만드는 함수 
function makeModal(target) {
    const modiId =target.parentNode.id;
    const modiArea = document.querySelector('.modiArea')
    const modiText = document.createElement('input'); 
    const modiHid = document.createElement('input'); 
    const modiBtn = document.createElement('button'); 
    const modiImg = document.createElement('img'); 
    modiHid.type = 'hidden';
    modiHid.value = modiId;
    modiText.id = 'modiText' + modiId;
    modiText.value = target.previousSibling.innerText;
    modiBtn.id = 'modify';
    modiBtn.innerHTML = '입력';
    modiBtn.appendChild(modiImg);
    modiImg.src = './img/plus.png'
    modiArea.appendChild(modiText);
    modiArea.appendChild(modiHid);
    modiHid.classList.add('modiHid');
    modiArea.appendChild(modiBtn);
    modiBtn.addEventListener('click', modifyTodo)
}

// 수정 버튼 함수
function modifyTodo() {
    const modifyId = parseInt(document.querySelector('.modiHid').value);
    let modifyTxt = document.querySelector('#modiText'+modifyId).value;
    
    // 배열에 해당 id를 찾아 텍스트 수정
    const modiObj = todoArr.find(todo => todo.id === modifyId);
    modiObj.text = modifyTxt;

    // DOM에서 해당 항목의 텍스트도 수정
    const modiLi = document.getElementById(modifyId);
    modiLi.querySelector('span').textContent = modifyTxt;

    saveTodo();
    location.reload();
}

// 시작 함수
function init() {
    loadTodo();
    inputBtn.addEventListener('click', startTodo);
    delAllBtn.addEventListener('click', delAll);
    countTodo();
}

init();