import Axios from "axios";

const customAxios = Axios.create({
  headers: {
    'Authorization': 'token 5199831f4dd3b79e7c5b7e0ebe75d67aa66e79d4'
  }
});

export default class GithubRepository {
  static findRepositoriesGit = async (termo, page) => {
    const resultado = await customAxios.get(`https://api.github.com/search/repositories?q=${termo}&per_page=10&page=${page}`);
    return resultado;
  }
}