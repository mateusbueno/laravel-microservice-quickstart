const { default: axios } = require('axios');
const { createStore, applyMiddleware } = require('redux');
const {default: createSagaMiddleware} = require('redux-saga');
const {take, put, call, actionChannel, debounce} = require('redux-saga/effects');


function reducer(state, action) {
    if (action.type === 'acaox') {
        return {value: action.value}
    }
    return state;
};

function* searchData(action) {
    //console.log('Hello word');
    //const channel = yield actionChannel('acaoy');
    //while(true) {
        console.log('antes de acao Y');
        //const action = yield take(channel);
        const search = action.value;
        try {
            const {data} = yield call(
                axios.get, 'http://nginx/api/videos?search=' + search
            );
            console.log(search);
            yield put({
                type: 'acaoX',
                value: data
            })
        } catch (error) {
            yield put ({
                type: 'acaoX',
                error: error
            })
        }
    //}
}

function* debounceSearch() {
    yield debounce(1000, 'acaoY', searchData);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(debounceSearch);

const action = (type, value) => store.dispatch({type, value});

action('acaoY', 'l');
action('acaoY', 'li');
action('acaoY', 'lii');
action('acaoY', 'liio');
action('acaoY', 'liiou');

console.log(store.getState());