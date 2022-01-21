import axios from "axios";
import _uniqBy from "lodash/uniqBy";

const _defaultMessage = "영화 제목을 검색해 보세요!";

export default {
  // export 되어지는 해당 코드가 store 의 모듈로 만들 것인지에 대한 여부.
  // true 라고 넣어줌으로써 ~/store/index.js 에서 module 에 추가해 줄 수 있음.
  namespaced: true,

  state: () => ({
    movies: [],
    message: _defaultMessage,
    loading: false,
    theMovie: {},
  }),
  getters: {},

  // mutations, actions 모두 methods 의 정의이다
  // mutations 는 state 를 수정할 수 있다.
  // actions 는 state 를 수정할 수 없다.
  // 따로 구분지어 둠으로써 데이터 관리의 복잡성을 줄여 준다.
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
    resetMovies(state) {
      state.movies = [];
      state.message = _defaultMessage;
      state.loading = false;
    },
  },
  actions: {
    async searchMovies({ state, commit }, payload) {
      if (state.loading) return;

      commit("updateState", {
        message: "",
        loading: true,
      });
      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1,
        });
        const { Search, totalResults } = res.data;
        commit("updateState", {
          movies: _uniqBy(Search, "imdbID"),
        });

        const total = parseInt(totalResults, 10);
        const pageLength = Math.ceil(total / 10);

        if (pageLength > 1) {
          for (let page = 2; page <= pageLength; page += 1) {
            if (page > payload.number / 10) break;
            const res = await _fetchMovie({
              ...payload,
              page,
            });

            const { Search } = res.data;
            commit("updateState", {
              movies: [...state.movies, ..._uniqBy(Search, "imdbID")],
            });
          }
        }
      } catch ({ message }) {
        commit("updateState", {
          movies: [],
          message,
        });
      } finally {
        commit("updateState", {
          loading: false,
        });
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) return;

      commit("updateState", {
        theMovie: {},
        loading: true,
      });

      try {
        const res = await _fetchMovie(payload);
        commit("updateState", {
          theMovie: res.data,
        });
      } catch (err) {
        commit("updateState", {
          theMovie: {},
        });
      } finally {
        commit("updateState", {
          loading: false,
        });
      }
    },
  },
};

async function _fetchMovie(payload) {
  return await axios.post("/.netlify/functions/movie", payload);
}
