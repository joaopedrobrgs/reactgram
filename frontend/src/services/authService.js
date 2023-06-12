import {api, requestConfig} from '../utils/config';

//Registrando um usuário:
const register = async(data) => {
	//Criando objeto de configuração utilizando a função "requestConfig":
    const config = requestConfig("POST", data);
    try{
        //Fazendo requisição com fetch: 
        const res = await fetch(api + "/users/register", config) //Parâmetros: 1º - URL, 2º - objeto de configuração.
        //Recebendo resposta do BACK END:
        .then((res) => res.json()) //Se der tudo certo com o registro, BACK END vai enviar o ID do usuário e o seu TOKEN
        .catch((err) => err); //Se der algo errado, BACK END vai enviar esse erro
        //Verificando se houve resposta do BACK END (se deu tudo certo):
        if(res){
            localStorage.setItem("user", JSON.stringify(res)); //Se deu tudo certo, iremos adicionar os dados desse usuário cadastrado no "localStorage" para que a gente possa extrair depois e ver se o usuário está logado ou não.
        }
    }
    //Pegando possível erro:
    catch (error){
        console.log(error);
    }
}
//Exportando funções de autenticação para serem utilizadas na aplicação:
const authService = {
    register
}
export default authService;