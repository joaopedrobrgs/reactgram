import {api, requestConfig} from '../utils/config';

//Registrando um usuário:
const register = async(data) => {
	//Criando objeto de configuração utilizando a função "requestConfig":
    const config = requestConfig("POST", data);
    try{
        //Fazendo requisição com fetch: 
        const res = await fetch(api + "/users/register", config) //Parâmetros: 1º - URL, 2º - objeto de configuração.
        .then((res) => res.json()) //Recebendo resposta do BACK END:
        .catch((err) => err); //Checando possível erro
        //Verificando se resposta foi livre de erros (pois significa que usuário foi cadastrado):
        //!Outra maneira seria checar se a resposta possui um ID, pois isso significaria que deu tudo certo.
        if(res && !res.errors){
            localStorage.setItem("user", JSON.stringify(res)); //Se deu tudo certo, iremos adicionar os dados desse usuário cadastrado no "localStorage" para que a gente possa extrair depois e ver se o usuário está logado ou não.
        }
        //Retornando resposta (com erro ou sem erro):
        //Se der tudo certo com o registro, BACK END vai enviar o ID do usuário e o seu TOKEN. Se deu algo errado, erro vai ser retornado.
        return res;
    }
    //Pegando possível erro:
    catch (error){
        console.log(error);
    }
}

//Logando usuário (bem parecido com função de registro):
const login = async(data) => {
    const config = requestConfig("POST", data);
    try{
        const res = await fetch(api + "/users/login", config) //Muda apenas URL para qual é feito o fetch
        .then((res) => res.json())
        .catch((err) => err);
        if(res && !res.errors){
            localStorage.setItem("user", JSON.stringify(res)); //usuário também é salvo no localStorage
        }
        return res;
    }
    catch (error){
        console.log(error);
    }
}

const logout = async (data) => {
    localStorage.removeItem("user");
}

//Exportando funções de autenticação para serem utilizadas na aplicação:
const authService = {
    register,
    logout,
    login
}
export default authService;